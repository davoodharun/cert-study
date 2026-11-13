# 04 - Composite actions

## What composite actions are

A composite action bundles multiple steps into one action. It is called from a workflow step and runs on the caller job's runner.

Composite actions are useful for repeated step logic such as setup, validation, formatting, or small deployment helpers.

## When to use composite actions

Use a composite action when you want to reuse steps.

Good fits:

- Standard language setup commands
- Install dependencies and run checks
- Generate metadata shared by many workflows
- Wrap a script with a clean input/output contract

Do not use a composite action when you need multiple jobs, a matrix, services, permissions, environments, or approval gates. Use a reusable workflow for those.

## Directory structure

Local composite action:

```text
.github/
  actions/
    setup-node-project/
      action.yml
```

Call it:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-node-project
    with:
      node-version: '22'
```

## Minimal `action.yml`

```yaml
name: Setup Node Project
description: Install Node.js and project dependencies

inputs:
  node-version:
    description: Node.js version
    required: true
  install-command:
    description: Dependency install command
    required: false
    default: npm ci

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: npm
    - run: ${{ inputs.install-command }}
      shell: bash
```

Composite action steps can use `run` and `uses` steps. For `run` steps in composite actions, specify `shell`.

## Inputs

Composite action inputs are strings.

```yaml
inputs:
  path:
    description: Path to lint
    required: false
    default: .
```

Use them with `${{ inputs.path }}`.

```yaml
runs:
  using: composite
  steps:
    - run: npm run lint -- ${{ inputs.path }}
      shell: bash
```

Security trap: treat inputs as untrusted if they can be influenced by a user or event payload. Prefer passing inputs as environment variables and quote carefully.

Safer shell pattern:

```yaml
runs:
  using: composite
  steps:
    - run: npm run lint -- "$TARGET_PATH"
      shell: bash
      env:
        TARGET_PATH: ${{ inputs.path }}
```

## Outputs

Composite action outputs map to step outputs.

```yaml
name: Generate Version
description: Create a version string

outputs:
  version:
    description: Generated version
    value: ${{ steps.version.outputs.value }}

runs:
  using: composite
  steps:
    - id: version
      run: echo "value=1.0.${{ github.run_number }}" >> "$GITHUB_OUTPUT"
      shell: bash
```

Caller:

```yaml
- id: version
  uses: ./.github/actions/generate-version

- run: echo "Version is ${{ steps.version.outputs.version }}"
```

## Environment variables

Composite actions can read env from the caller step/job and can set env for later steps in the same job by writing to `$GITHUB_ENV`.

```yaml
runs:
  using: composite
  steps:
    - run: echo "TOOL_CACHE=$HOME/.cache/tools" >> "$GITHUB_ENV"
      shell: bash
```

## Working directory

Composite action `run` steps execute relative to the caller workspace unless you set `working-directory`.

```yaml
runs:
  using: composite
  steps:
    - run: npm test
      shell: bash
      working-directory: app
```

## Accessing files inside the action

Use `github.action_path` to refer to files shipped with the action.

```yaml
runs:
  using: composite
  steps:
    - run: "$GITHUB_ACTION_PATH/scripts/check.sh"
      shell: bash
      env:
        GITHUB_ACTION_PATH: ${{ github.action_path }}
```

## Composite action with scripts

Structure:

```text
.github/actions/validate/
  action.yml
  scripts/
    validate.sh
```

`action.yml`:

```yaml
name: Validate Project
description: Run repository validation

inputs:
  mode:
    description: Validation mode
    required: false
    default: quick

runs:
  using: composite
  steps:
    - run: chmod +x "$GITHUB_ACTION_PATH/scripts/validate.sh"
      shell: bash
      env:
        GITHUB_ACTION_PATH: ${{ github.action_path }}
    - run: "$GITHUB_ACTION_PATH/scripts/validate.sh" "$MODE"
      shell: bash
      env:
        GITHUB_ACTION_PATH: ${{ github.action_path }}
        MODE: ${{ inputs.mode }}
```

## Calling local vs remote composite actions

Local action:

```yaml
- uses: ./.github/actions/validate
```

Remote action:

```yaml
- uses: octo-org/actions/validate@v1
```

For remote third-party actions, pin to a full commit SHA in high-security environments.

## Distribution and versioning

Composite actions can be:

- Local to a repository.
- Private in an org/enterprise if policy allows access.
- Public and optionally published to GitHub Marketplace.

Use tags/releases for stable versions:

```yaml
- uses: octo-org/actions/setup-node-project@v1
```

Use immutable SHA pinning for stronger supply-chain control:

```yaml
- uses: octo-org/actions/setup-node-project@172239021f7ba04fe7327647b213799853a9eb89
```

## Composite vs JavaScript vs Docker actions

| Action type | Best for | Runtime |
|-------------|----------|---------|
| Composite | Reusing workflow steps and shell commands | Caller runner |
| JavaScript | Rich logic, API calls, fast startup | Node runtime on runner |
| Docker | Fully controlled environment | Container runtime, usually Linux |

## Common limitations and traps

- Composite actions do not define jobs or runners.
- Composite actions are invoked from workflow steps.
- `run` steps inside composite actions should declare `shell`.
- Inputs are strings; validate and quote them.
- Composite actions inherit the caller job's token/secrets only if the caller passes them via env/inputs.
- Use reusable workflows for job-level concerns such as permissions, services, environments, and matrices.