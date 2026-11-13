# 05 - Consume and troubleshoot workflows

## Where to troubleshoot

| Place | What to inspect |
|-------|-----------------|
| Actions tab | Workflow run list, run status, rerun options |
| Run summary | Jobs, annotations, artifacts, timing, summaries |
| Job logs | Step commands, exit codes, grouped logs |
| Visualization graph | Job dependencies and skipped jobs |
| Workflow file | Events, filters, permissions, `if`, `needs`, matrix |
| API/CLI | Programmatic logs, artifacts, run retention |

## Reading failures

Work from outer to inner:

1. Did the workflow trigger?
2. Did branch/path/type filters skip it?
3. Did job-level `if` skip a job?
4. Did `needs` block downstream jobs?
5. Did a matrix variant fail?
6. Did a step fail because of auth, path, shell, missing dependency, or permissions?

## Common failure patterns

| Symptom | Likely cause |
|---------|--------------|
| Workflow did not start | Wrong event, branch/path filter, disabled workflow, workflow file not on default branch for some events |
| Required check pending | Workflow skipped by filters but branch protection requires it |
| `Resource not accessible by integration` | `GITHUB_TOKEN` permissions too low or fork PR restrictions |
| Secret is empty | Secret not available to event/fork/reusable workflow/environment |
| `Unrecognized named-value: secrets` | Using secrets in unsupported expression location |
| Reusable workflow input error | Missing required input or wrong input type |
| `uses` path not found | Local action path wrong or checkout missing |
| Script works locally but not in Actions | Different shell, OS, working directory, env, or installed tools |
| Matrix job name confusing | Matrix axis values not included in job `name` |

## Debug logging

Enable debug logging with repository secrets or variables:

| Name | Effect |
|------|--------|
| `ACTIONS_STEP_DEBUG` = `true` | More detailed step logs |
| `ACTIONS_RUNNER_DEBUG` = `true` | More runner diagnostic logs |

## Reruns

You can rerun:

- All jobs.
- Failed jobs.
- Individual jobs, including individual matrix jobs.

Use selective reruns when one matrix leg failed because of a transient external dependency.

## Matrix troubleshooting

Name matrix jobs clearly:

```yaml
jobs:
  test:
    name: Test Node ${{ matrix.node }} on ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [20, 22]
```

If one axis fails, ask:

- Is the failure OS-specific?
- Is the runtime version unsupported?
- Did `include` or `exclude` change the final matrix?
- Did `fail-fast` cancel other jobs before they produced evidence?

## Artifacts and logs

Artifacts are files uploaded by workflows. Logs are execution records. Caches are dependency stores. Do not mix them up.

```yaml
- name: Upload screenshots
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-screenshots
    path: test-results/screenshots/
```

Use artifacts for test reports, screenshots, build outputs, and coverage. Set retention based on compliance and storage cost.

## Workflow templates vs reusable workflows vs composite actions

| Mechanism | What happens when consumed | Best for |
|-----------|----------------------------|----------|
| Starter workflow/template | File is copied into the repo | Bootstrapping common workflows |
| Reusable workflow | Caller invokes central workflow by ref | Standardized jobs/pipelines |
| Composite action | Caller invokes reusable steps | Shared setup/check logic |

Exam trap: starter workflow updates do not automatically update repos that already copied the template.

## Disable vs delete workflow

| Choice | Effect |
|--------|--------|
| Disable workflow | Keeps file/history but stops automatic runs |
| Delete workflow file | Removes workflow definition from repo |

Manual and scheduled behavior depends on whether the workflow exists, is enabled, and is available on the relevant branch.

## YAML troubleshooting

Common YAML mistakes:

- Incorrect indentation under `jobs`, `steps`, or `with`.
- Writing `on` incorrectly in tools that parse YAML 1.1, where `on` can be treated as boolean. GitHub handles workflow YAML, but external linters may need schema support.
- Using tabs for indentation.
- Duplicating keys, where the latter value may win or validation fails.
- Putting arrays where mappings are required.

Use VS Code GitHub Actions extension or YAML schema validation for early feedback.

## Inspecting contexts safely

You can print context JSON for debugging, but avoid exposing secrets or sensitive event payloads.

```yaml
- name: Debug event
  run: echo '${{ toJSON(github.event_name) }}'
```

Safer than dumping all of `github.event` in public logs.

## Troubleshooting reusable workflows

Check:

- Is the called workflow in `.github/workflows/`?
- Does it include `on: workflow_call`?
- Is the caller using `jobs.<job_id>.uses`?
- Are required inputs supplied with matching types?
- Are secrets explicitly mapped or inherited?
- Are permissions sufficient at caller, callee, repo, org, and enterprise levels?
- Is the ref (`@v1`, SHA, branch) correct and accessible?

## Troubleshooting composite actions

Check:

- Did the workflow run `actions/checkout` before using a local action?
- Is the path correct?
- Does `action.yml` use `runs.using: composite`?
- Do `run` steps specify `shell`?
- Are scripts executable or invoked with an interpreter?
- Are inputs safely quoted?

## High-yield diagnostic examples

### Missing checkout for local action

Wrong:

```yaml
steps:
  - uses: ./.github/actions/setup
```

Correct:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup
```

### Reusable workflow called from steps

Wrong:

```yaml
steps:
  - uses: octo-org/automation/.github/workflows/ci.yml@v1
```

Correct:

```yaml
jobs:
  ci:
    uses: octo-org/automation/.github/workflows/ci.yml@v1
```