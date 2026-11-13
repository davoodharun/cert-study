# GH-200 quick reference and traps

## Pick the right mechanism

| Scenario | Likely answer |
|----------|---------------|
| Reuse jobs across repositories | **Reusable workflow** |
| Reuse a sequence of steps | **Composite action** |
| Give repos a starting workflow file | **Starter workflow/template** |
| Manual deployment with inputs | `workflow_dispatch` |
| Workflow called by another workflow | `workflow_call` |
| Nightly automation | `schedule` |
| External system triggers GitHub workflow | `repository_dispatch` |
| Run after another workflow completes | `workflow_run` |
| Test PR code from forks | `pull_request` |
| Label/comment on fork PR metadata | `pull_request_target`, carefully |
| Pass small string step-to-step | `$GITHUB_OUTPUT` then step output |
| Pass env value to later steps in same job | `$GITHUB_ENV` |
| Pass data job-to-job | Job outputs via `needs` |
| Pass files job-to-job | Artifacts |
| Speed dependency install | Cache |
| Human approval before deploy | Environment protection |
| Avoid long-lived cloud secrets | OIDC with `id-token: write` |
| Limit token access | `permissions` |
| Avoid overlapping deploys | `concurrency` |
| Run DB during tests | `services:` |

## Reusable workflow vs composite action

| Question | Reusable workflow | Composite action |
|----------|-------------------|------------------|
| Called from | `jobs.<job_id>.uses` | `steps[*].uses` |
| Reuses | Jobs/pipelines | Steps |
| File location | `.github/workflows/*.yml` | Any action folder with `action.yml` |
| Required trigger/metadata | `on: workflow_call` | `runs.using: composite` |
| Can set `runs-on` | Yes | No |
| Can use matrix/services/environments | Yes | No, caller job owns these |
| Secrets | Explicit mapping or inherit | Passed through inputs/env by caller |

## Trigger crib sheet

```yaml
on:
  push:
    branches: [main]
    paths: ['src/**']
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [dev, staging, prod]
        required: true
  schedule:
    - cron: '0 6 * * 1'
```

## Reusable workflow syntax

Callee:

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
    uses: octo-org/automation/.github/workflows/node-ci.yml@v1
    with:
      node-version: '22'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

## Composite action syntax

```yaml
name: Setup Project
description: Setup tools and dependencies

inputs:
  node-version:
    required: true
    description: Node version

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    - run: npm ci
      shell: bash
```

Caller:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
    with:
      node-version: '22'
```

## Data passing

| Need | Mechanism |
|------|-----------|
| Step creates output | `echo "name=value" >> "$GITHUB_OUTPUT"` |
| Later step reads output | `${{ steps.<id>.outputs.<name> }}` |
| Later job reads output | `${{ needs.<job>.outputs.<name> }}` |
| Later step reads env var | `echo "NAME=value" >> "$GITHUB_ENV"` |
| Files after run | `actions/upload-artifact` |
| Dependency reuse | `actions/cache` or setup action cache |

## Permissions one-liners

| Permission | Common use |
|------------|------------|
| `contents: read` | Checkout/read repo |
| `contents: write` | Create commits/releases/tags |
| `packages: write` | Publish packages |
| `pull-requests: write` | PR comments/labels/reviews |
| `issues: write` | Issue comments/labels |
| `security-events: write` | Upload scanning results |
| `id-token: write` | OIDC federation |

## Common traps

1. **Reusable workflow call location:** job level, not step level.
2. **Composite action call location:** step level, not job level.
3. **Starter workflow:** copied once; central updates do not automatically apply.
4. **Secrets and reusable workflows:** not automatic unless explicitly mapped or inherited.
5. **`pull_request_target`:** privileged base context; do not run untrusted PR code with secrets.
6. **Artifacts vs cache:** artifacts preserve outputs; caches speed dependency reuse.
7. **Outputs:** step output -> job output -> workflow output for reusable workflows.
8. **Path filters:** can skip workflows and leave required checks pending.
9. **`GITHUB_TOKEN`:** ephemeral but must still be least privilege.
10. **SHA pinning:** most immutable, but requires update process.
11. **`schedule`:** UTC and default branch.
12. **Composite `run` steps:** specify `shell`.
13. **Local actions:** need checkout first.
14. **Matrix fail-fast:** one failure can cancel other matrix jobs unless disabled.
15. **Environment secrets:** only available to jobs using that environment.

## Quick scenario drills

| Question | Answer |
|----------|--------|
| Standardize CI logic across repos and update centrally | Reusable workflow |
| Standardize five setup commands inside many jobs | Composite action |
| Need approval before prod deploy | Environment with required reviewers |
| Need cloud auth without storing a secret | OIDC and `id-token: write` |
| Need Postgres during test job | `services.postgres` |
| Need generated version in later step | `$GITHUB_OUTPUT` |
| Need generated version in later job | Job output and `needs` |
| Need coverage report after workflow | Upload artifact or step summary |
| Need to prevent two production deploys at once | `concurrency` |
| Need to inspect why one Node/OS combo failed | Matrix job logs and rerun individual job |