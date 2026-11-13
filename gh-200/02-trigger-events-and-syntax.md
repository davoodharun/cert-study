# 02 - Trigger events and workflow syntax

## The `on:` key

`on:` defines the events that start a workflow. It can be a string, array, or mapping.

```yaml
on: push
```

```yaml
on: [push, pull_request]
```

```yaml
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]
```

Exam rule: if an event needs filters or activity types, use mapping form.

## Common trigger types

| Trigger | Best for | Example |
|---------|----------|---------|
| `push` | CI after commits land | Build on `main` |
| `pull_request` | Validate proposed changes safely | Test PRs before merge |
| `pull_request_target` | Automation needing base repo permissions | Label/comment on PRs from forks |
| `workflow_dispatch` | Manual runs | Deploy selected environment |
| `workflow_call` | Reusable workflows | Central org CI workflow |
| `schedule` | Cron automation | Nightly dependency scan |
| `release` | Publish on release events | Upload binaries |
| `workflow_run` | Chain after another workflow completes | Deploy after CI completes |
| `repository_dispatch` | Custom external webhook-style trigger | Trigger from external system |
| `issues` / `issue_comment` | Issue automation | Triage labels |

## Branch and path filters

Filters narrow events. For `push`, branch filters apply to pushed branches. For `pull_request`, branch filters apply to the PR base branch.

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    paths:
      - 'src/**'
      - '.github/workflows/ci.yml'
```

Use ignore variants when exclusions are clearer:

```yaml
on:
  pull_request:
    branches-ignore:
      - 'docs/**'
    paths-ignore:
      - '**/*.md'
```

Important traps:

- You cannot use `branches` and `branches-ignore` for the same event.
- You cannot use `paths` and `paths-ignore` for the same event.
- Path filters are not evaluated for tag pushes.
- Skipped workflows can leave required checks pending if branch protection expects them.

## Activity types

Many events support `types` to limit event actions.

```yaml
on:
  issues:
    types: [opened, labeled]
```

Common examples:

| Event | Useful `types` |
|-------|----------------|
| `pull_request` | `opened`, `synchronize`, `reopened`, `ready_for_review`, `closed` |
| `issues` | `opened`, `edited`, `labeled`, `assigned`, `closed` |
| `release` | `published`, `created`, `edited`, `deleted`, `prereleased` |
| `workflow_run` | `completed`, `requested`, `in_progress` |

## Manual trigger: `workflow_dispatch`

Use manual inputs for human-operated workflows.

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Deployment environment
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod
      dry_run:
        description: Skip actual deployment
        required: false
        default: true
        type: boolean
      version:
        description: Version to deploy
        required: true
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy ${{ inputs.version }} to ${{ inputs.environment }}"
```

Input types to know: `boolean`, `choice`, `number`, `environment`, `string`.

## Reusable trigger: `workflow_call`

`workflow_call` makes a workflow callable from another workflow.

```yaml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      npm-token:
        required: false
```

Caller:

```yaml
jobs:
  ci:
    uses: octo-org/platform/.github/workflows/node-ci.yml@v1
    with:
      node-version: '22'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

## Scheduled workflows

Schedules use POSIX cron in UTC.

```yaml
on:
  schedule:
    - cron: '15 6 * * 1-5'
```

This example runs at 06:15 UTC Monday-Friday.

Trap: scheduled workflows run on the latest commit of the default branch.

## Push tags and release workflows

Run on semantic version tags:

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
```

Run when a release is published:

```yaml
on:
  release:
    types: [published]
```

Use tag pushes when the tag is the source of truth. Use release events when the GitHub Release object is the source of truth.

## `pull_request` vs `pull_request_target`

| Trigger | Runs in context of | Token/secrets posture | Use |
|---------|--------------------|-----------------------|-----|
| `pull_request` | Merge commit from PR branch | Safer for untrusted code | Build/test PR code |
| `pull_request_target` | Base branch workflow | Can access base repo permissions/secrets | Label/comment/triage PR metadata |

Security trap: with `pull_request_target`, do not check out and execute untrusted PR code with privileged token or secrets.

Safer pattern for fork PR labels:

```yaml
on:
  pull_request_target:
    types: [opened, edited, synchronize]

permissions:
  pull-requests: write
  contents: read

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v5
```

## `workflow_run`

Use `workflow_run` to respond after another workflow runs.

```yaml
on:
  workflow_run:
    workflows: [CI]
    types: [completed]

jobs:
  deploy:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

Good for separating untrusted validation from privileged deployment.

## `repository_dispatch`

Use this when an external system needs to trigger automation through the GitHub API.

```yaml
on:
  repository_dispatch:
    types: [external-build-complete]

jobs:
  respond:
    runs-on: ubuntu-latest
    steps:
      - run: echo '${{ github.event.client_payload.version }}'
```

## Expression syntax

Expressions use `${{ }}`.

```yaml
if: ${{ github.ref == 'refs/heads/main' && success() }}
```

In many `if:` clauses, the outer `${{ }}` is optional:

```yaml
if: github.ref == 'refs/heads/main'
```

Useful operators/functions:

| Syntax | Purpose |
|--------|---------|
| `==`, `!=` | Equality |
| `&&`, `||`, `!` | Boolean logic |
| `contains(a, b)` | Contains value/string |
| `startsWith(a, b)` | Prefix check |
| `endsWith(a, b)` | Suffix check |
| `format()` | String formatting |
| `fromJSON()` | Convert JSON string to object/array |
| `toJSON()` | Debug context as JSON, carefully |

Dynamic matrix example:

```yaml
jobs:
  plan:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set.outputs.matrix }}
    steps:
      - id: set
        run: echo 'matrix={"node":[20,22]}' >> "$GITHUB_OUTPUT"

  test:
    needs: plan
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJSON(needs.plan.outputs.matrix) }}
    steps:
      - run: echo "Node ${{ matrix.node }}"
```

## Concurrency

Use concurrency to prevent overlapping deploys or cancel stale CI runs.

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false
```

For PR CI:

```yaml
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Defaults

Set shell and working directory defaults.

```yaml
defaults:
  run:
    shell: bash
    working-directory: app
```

## Syntax traps to memorize

- `uses` and `run` are mutually exclusive in a single step.
- Reusable workflows are called at the job level with `jobs.<job_id>.uses`, not inside `steps`.
- Composite actions are called inside `steps` with `uses`.
- Secrets are not automatically passed to reusable workflows unless using `secrets: inherit` or explicit mapping.
- `env` values are strings; use expressions carefully for booleans.
- `github.event` shape depends on the event type.