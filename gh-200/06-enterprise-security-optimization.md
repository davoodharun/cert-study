# 06 - Enterprise, security, and optimization

## Enterprise governance

Organizations and enterprises can control which actions and reusable workflows are allowed.

Common policy controls:

| Control | Purpose |
|---------|---------|
| Allow all actions | Most permissive |
| Allow local actions only | Restrict to same enterprise/org/repo |
| Allow selected actions | Permit list trusted sources |
| Block selected actions | Deny known risky sources |
| Require full-length SHA pinning | Stronger supply-chain control |
| Require approval for outside collaborators | Prevent untrusted workflow execution |

Exam idea: enterprise policy can override organization and repository preferences.

## Runners

| Runner type | Best for | Notes |
|-------------|----------|-------|
| GitHub-hosted | Standard CI/CD, low ops overhead | Fresh VM, preinstalled tools, billed minutes |
| Larger GitHub-hosted | More CPU/RAM/disk, static IP options | Useful for heavy builds or network allow lists |
| Self-hosted | Custom network, hardware, compliance | You patch, secure, scale, and monitor |

Self-hosted runner groups control which repos can use which runners.

```yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64, production]
```

Security reminder: never attach untrusted public PR workloads to sensitive self-hosted runners.

## Runner images and tools

GitHub-hosted runners include preinstalled tools, but image contents change. Use setup actions or explicit installation for required versions.

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm
```

Check image release notes and toolcache documentation when a tool version matters.

## Secrets and variables

| Store | Encrypted | Good for |
|-------|-----------|----------|
| Secrets | Yes | Tokens, passwords, private keys |
| Variables | No secret encryption | Regions, names, feature flags |

Scopes:

- Organization
- Repository
- Environment

Environment secrets and variables are available only to jobs that reference that environment.

```yaml
jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
          REGION: ${{ vars.REGION }}
```

## Environment protection

Environments can require reviewers, wait timers, branch restrictions, and deployment rules.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
```

Use this when a workflow should pause before production deployment.

## `GITHUB_TOKEN`

`GITHUB_TOKEN` is automatically created for each workflow run. It is ephemeral and scoped to the repository. Configure least privilege.

```yaml
permissions:
  contents: read

jobs:
  publish:
    permissions:
      contents: read
      packages: write
    runs-on: ubuntu-latest
    steps:
      - run: echo "Publish package"
```

Common permission scopes:

| Scope | Use |
|-------|-----|
| `contents` | Read/write repository contents |
| `packages` | Publish/read packages |
| `pull-requests` | Comment/update PRs |
| `issues` | Create/update issues |
| `security-events` | Upload code scanning results |
| `id-token` | Request OIDC token |

Trap: set `permissions: {}` or minimal read permissions by default, then expand only for jobs that need write access.

## OIDC for cloud federation

OIDC lets workflows authenticate to cloud providers without storing long-lived cloud secrets.

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ vars.AZURE_CLIENT_ID }}
          tenant-id: ${{ vars.AZURE_TENANT_ID }}
          subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}
      - run: az deployment group create --template-file main.bicep
```

Exam idea: choose OIDC over storing cloud provider secrets when federation is available.

## Script injection risk

Event data can be attacker-controlled. Avoid placing untrusted data directly inside scripts.

Risky:

```yaml
- run: echo "${{ github.event.pull_request.title }}"
```

Safer:

```yaml
- run: printf '%s\n' "$PR_TITLE"
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
```

Also prefer vetted actions over complex inline scripts when possible.

## Pinning actions

For stronger supply-chain security, pin third-party actions to a full commit SHA.

```yaml
- uses: actions/checkout@v4
```

The tag form is common and readable. For high-security third-party actions:

```yaml
- uses: vendor/action@172239021f7ba04fe7327647b213799853a9eb89
```

Know the tradeoff: SHA pinning is immutable but requires update management.

## Artifact attestations

Artifact attestations record provenance for build outputs. They help consumers verify where an artifact came from and which workflow produced it.

High-level flow:

1. Build artifact in workflow.
2. Generate attestation/provenance.
3. Verify attestation before deployment or consumption.

## Caching

Use caching for dependencies that are expensive to download or compute.

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
```

Many setup actions include built-in caching:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm
```

Cache traps:

- Cache dependencies, not final build artifacts.
- Use lockfiles in cache keys.
- Restore keys can return partial matches.
- Bad cache keys can create stale or ineffective caches.

## Artifacts and retention

Artifacts are for files from workflow runs. Retention affects storage cost and compliance.

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/
    retention-days: 7
```

At scale, retention can be managed at repository or organization level and through APIs.

## Cost and performance strategies

- Cancel stale runs with `concurrency`.
- Use path filters to avoid unnecessary work.
- Right-size matrix dimensions.
- Use `max-parallel` for expensive jobs.
- Cache dependencies.
- Split slow jobs only when it reduces critical path.
- Use artifacts to avoid rebuilding the same output.
- Choose self-hosted or larger runners only when the workload justifies it.

## Enterprise scenario answers

| Scenario | Likely answer |
|----------|---------------|
| Standard workflow across 100 repos | Reusable workflow or organization template |
| Share repeated setup steps | Composite action |
| Restrict untrusted actions | Org/enterprise Actions policy |
| Need private network access | Self-hosted runner or larger hosted runner with networking features |
| Avoid cloud secrets | OIDC federation |
| Production approval | Environment protection rules |
| Token has too much access | Set least-privilege `permissions` |
| Builds are slow due to dependency download | Cache dependencies/setup action cache |