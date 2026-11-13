# 01 - Author and manage workflows

## Workflow anatomy

A workflow is a YAML file in `.github/workflows/`. It defines when automation runs, what permissions it has, which jobs execute, and which steps each job performs.

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test
```

Know these top-level keys:

| Key | Purpose |
|-----|---------|
| `name` | Display name in the Actions UI |
| `on` | Events that trigger the workflow |
| `permissions` | Default `GITHUB_TOKEN` permissions for jobs |
| `env` | Environment variables available to jobs/steps |
| `defaults` | Default shell or working directory |
| `concurrency` | Limit overlapping workflow/job runs |
| `jobs` | Work to run; each job gets a runner |

## Jobs and steps

Jobs run in parallel by default. Use `needs` to create dependencies.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh
```

Step types:

| Step | Example | Notes |
|------|---------|-------|
| Action step | `uses: actions/checkout@v4` | Calls an action |
| Shell step | `run: npm test` | Runs in a shell on the runner |
| Composite step | `uses: ./.github/actions/setup` | Calls local composite action |

## Conditions

Use `if:` at the job or step level. Job-level conditions decide whether the whole job starts. Step-level conditions decide whether a step runs after the runner is allocated.

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

Useful status functions:

| Function | Meaning |
|----------|---------|
| `success()` | Previous steps/jobs succeeded |
| `failure()` | Something failed |
| `cancelled()` | Run was cancelled |
| `always()` | Run even after failure/cancel, often for cleanup |

Example cleanup step:

```yaml
- name: Upload test logs
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-logs
    path: logs/
```

## Contexts

Contexts expose workflow metadata. They are read with expression syntax: `${{ ... }}`.

| Context | Example | Use |
|---------|---------|-----|
| `github` | `${{ github.ref }}` | Event, repo, actor, SHA, branch/tag refs |
| `env` | `${{ env.NODE_ENV }}` | Workflow/job/step env vars |
| `vars` | `${{ vars.REGION }}` | Repository/org/environment variables |
| `secrets` | `${{ secrets.NPM_TOKEN }}` | Encrypted secrets |
| `inputs` | `${{ inputs.environment }}` | Manual/reusable workflow inputs |
| `matrix` | `${{ matrix.node }}` | Current matrix value |
| `needs` | `${{ needs.build.outputs.image }}` | Outputs from dependent jobs |
| `steps` | `${{ steps.meta.outputs.version }}` | Outputs from prior steps in same job |
| `runner` | `${{ runner.os }}` | Runner metadata |

Important distinction:

- `${{ ... }}` expressions are evaluated by GitHub Actions.
- `$VAR`, `%VAR%`, or `$env:VAR` are evaluated by the shell on the runner.

Example:

```yaml
- name: Show branch
  env:
    BRANCH_NAME: ${{ github.ref_name }}
  run: echo "Running on $BRANCH_NAME"
```

## Passing data

### Step output

Write to `$GITHUB_OUTPUT`.

```yaml
- id: version
  run: echo "value=1.2.3" >> "$GITHUB_OUTPUT"

- run: echo "Version is ${{ steps.version.outputs.value }}"
```

### Job output

Map step outputs to job outputs, then consume through `needs`.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.meta.outputs.image }}
    steps:
      - id: meta
        run: echo "image=ghcr.io/acme/app:${{ github.sha }}" >> "$GITHUB_OUTPUT"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.image }}"
```

### Environment variables

Write to `$GITHUB_ENV` for later steps in the same job.

```yaml
- run: echo "BUILD_MODE=release" >> "$GITHUB_ENV"
- run: echo "Mode is $BUILD_MODE"
```

### Artifacts

Artifacts move files between jobs or preserve files after the run.

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
    retention-days: 14
```

## Matrix strategy

Matrix jobs expand one job definition into many job runs.

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      max-parallel: 3
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [20, 22]
        exclude:
          - os: windows-latest
            node: 20
        include:
          - os: ubuntu-latest
            node: 24
            experimental: true
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

Exam traps:

- `fail-fast: false` keeps other matrix jobs running after one variant fails.
- `max-parallel` controls concurrency/cost.
- `include` can add new combinations or add properties to existing combinations.
- Runner labels such as `ubuntu-latest` can move over time. For strict reproducibility, pin a specific image label where supported.

## Services

Use `services:` when a job needs a dependent container like Postgres or Redis.

```yaml
jobs:
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
```

## YAML anchors and aliases

YAML anchors reuse mappings inside one workflow file. They do not replace reusable workflows or actions.

```yaml
env: &common-env
  NODE_ENV: test
  CI: true

jobs:
  unit:
    runs-on: ubuntu-latest
    env:
      <<: *common-env
      TEST_SUITE: unit
    steps:
      - run: npm test

  integration:
    runs-on: ubuntu-latest
    env:
      <<: *common-env
      TEST_SUITE: integration
    steps:
      - run: npm run test:integration
```

## Job summaries

Write Markdown to `$GITHUB_STEP_SUMMARY`.

```yaml
- name: Summarize coverage
  run: |
    echo "## Coverage" >> "$GITHUB_STEP_SUMMARY"
    echo "Line coverage: 87%" >> "$GITHUB_STEP_SUMMARY"
```

## High-yield reminders

- Use least-privilege `permissions` at workflow or job level.
- Use outputs for small strings, artifacts for files, caches for dependencies.
- Use `needs` for dependencies and cross-job outputs.
- Use contexts for metadata and shell variables for runner-time behavior.
- Treat user-controlled event data as untrusted, especially in `pull_request` workflows.