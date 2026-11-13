# 03 - Reusable workflows

## What reusable workflows are

A reusable workflow is a workflow called by another workflow. It centralizes job-level automation such as CI, release, deployment, scanning, or policy checks.

Reusable workflows are defined in `.github/workflows/*.yml` and must include `on: workflow_call`.

## When to use reusable workflows

Use a reusable workflow when you want to reuse one or more jobs.

Good fits:

- Standard CI across many repositories
- Centralized deploy pipeline with approval gates
- Organization security scan workflow
- Language build workflow that emits artifacts or reports

Avoid reusable workflows for tiny repeated step sequences. Use a composite action for step-level reuse.

## Minimal reusable workflow

Reusable workflow file in the provider repo:

```yaml
# .github/workflows/node-ci.yml
name: Reusable Node CI

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      npm-token:
        required: false

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm
      - run: npm ci
      - run: npm test
```

Caller workflow:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    uses: octo-org/automation/.github/workflows/node-ci.yml@v1
    with:
      node-version: '22'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

Key syntax: reusable workflows are called under `jobs`, not `steps`.

## Inputs

Reusable workflow inputs require `type`.

```yaml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      run-tests:
        required: false
        default: true
        type: boolean
      retries:
        required: false
        default: 1
        type: number
```

Consume with `inputs`:

```yaml
- run: echo "Deploying to ${{ inputs.environment }}"
```

## Secrets

Reusable workflows do not automatically receive caller secrets.

Explicit mapping:

```yaml
jobs:
  deploy:
    uses: octo-org/automation/.github/workflows/deploy.yml@v1
    secrets:
      cloud-token: ${{ secrets.CLOUD_TOKEN }}
```

Declare in callee:

```yaml
on:
  workflow_call:
    secrets:
      cloud-token:
        required: true
```

Use inside callee:

```yaml
- run: ./deploy.sh
  env:
    CLOUD_TOKEN: ${{ secrets.cloud-token }}
```

Inheritance:

```yaml
jobs:
  deploy:
    uses: octo-org/automation/.github/workflows/deploy.yml@v1
    secrets: inherit
```

Exam trap: `secrets: inherit` is convenient inside an org/enterprise, but explicit mapping is easier to reason about and limits exposure.

## Outputs

Reusable workflow outputs are mapped from job outputs.

Reusable workflow:

```yaml
name: Build Image

on:
  workflow_call:
    outputs:
      image:
        description: Built image reference
        value: ${{ jobs.build.outputs.image }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.meta.outputs.image }}
    steps:
      - id: meta
        run: echo "image=ghcr.io/acme/app:${{ github.sha }}" >> "$GITHUB_OUTPUT"
```

Caller:

```yaml
jobs:
  build:
    uses: octo-org/automation/.github/workflows/build-image.yml@v1

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.image }}"
```

## Permissions

Caller and called workflows both matter.

The caller can set permissions on the job that invokes the reusable workflow:

```yaml
jobs:
  scan:
    permissions:
      contents: read
      security-events: write
    uses: octo-org/security/.github/workflows/codeql.yml@v2
```

Inside the reusable workflow, prefer least privilege:

```yaml
permissions:
  contents: read
```

Trap: permissions can be reduced but should not be assumed to magically expand beyond policy and caller/repo/org restrictions.

## Environments and approvals

Put environment protection where the deployment job actually runs.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh
```

If the deployment job is inside the reusable workflow, the environment declaration belongs inside that reusable workflow job.

## Matrix with reusable workflows

Call a reusable workflow from a matrix job:

```yaml
jobs:
  ci:
    strategy:
      matrix:
        node: [20, 22]
    uses: octo-org/automation/.github/workflows/node-ci.yml@v1
    with:
      node-version: ${{ matrix.node }}
```

## Nested reusable workflows

Reusable workflows can call other reusable workflows, but keep the chain understandable. For exam scenarios, identify where inputs, secrets, outputs, and permissions cross each boundary.

## Versioning

Call reusable workflows by a stable ref:

```yaml
uses: octo-org/automation/.github/workflows/node-ci.yml@v1
```

Better security for third-party or high-risk automation:

```yaml
uses: octo-org/automation/.github/workflows/node-ci.yml@172239021f7ba04fe7327647b213799853a9eb89
```

Tradeoff:

| Ref | Pros | Cons |
|-----|------|------|
| Branch, `@main` | Easy updates | Unstable, risky |
| Tag, `@v1` | Stable major version | Tag can move unless protected |
| SHA | Immutable | Manual updates required |

## Reusable workflow vs composite action vs starter workflow

| Feature | Reusable workflow | Composite action | Starter workflow |
|---------|-------------------|------------------|------------------|
| Reuses | Jobs/workflows | Steps | Initial workflow template |
| Called from | `jobs.<id>.uses` | `steps[*].uses` | Copied into repo |
| Can define `runs-on` | Yes | No, uses caller job runner | Yes after copied |
| Can use secrets | Yes, explicit/inherited | Via inputs/env from caller | Normal workflow behavior |
| Central updates apply | Yes, when callers use updated ref | Yes, when callers use updated ref | No, copied file becomes independent |

## Design checklist

- Define a small, stable input contract.
- Map only the secrets the workflow needs.
- Publish versioned tags/releases.
- Document required permissions.
- Return outputs that downstream jobs need.
- Avoid hiding too much policy in a workflow with vague inputs.

## Common exam traps

- Calling reusable workflows from `steps` is wrong.
- Missing `on: workflow_call` means the workflow is not reusable.
- Inputs need `type` for `workflow_call`.
- Secrets are not automatically passed.
- Workflow outputs must map through workflow output -> job output -> step output.