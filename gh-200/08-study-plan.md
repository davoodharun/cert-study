# GH-200 study plan

## Goal

Build enough practical fluency to answer scenario questions about authoring, consuming, securing, troubleshooting, and governing GitHub Actions.

The plan assumes 60-90 minutes per day for 10 days. If you have less time, combine days 1-2, 5-6, and 8-9.

## Day 1 - Workflow fundamentals

Read:

- [01-workflow-authoring.md](./01-workflow-authoring.md)
- Official workflow syntax docs overview

Hands-on:

- Create a workflow triggered by `push` and `pull_request`.
- Add `permissions: contents: read`.
- Add two jobs, one depending on the other with `needs`.
- Add one job-level `if` condition.

Checkpoint:

- Explain the difference between workflow, job, step, action, runner, and event.

## Day 2 - Trigger events and syntax

Read:

- [02-trigger-events-and-syntax.md](./02-trigger-events-and-syntax.md)

Hands-on:

- Add `workflow_dispatch` with `choice`, `boolean`, and `string` inputs.
- Add branch and path filters.
- Add a scheduled workflow.

Checkpoint:

- Explain when to choose `push`, `pull_request`, `workflow_dispatch`, `workflow_call`, `schedule`, `workflow_run`, and `repository_dispatch`.

## Day 3 - Contexts, expressions, and data flow

Read:

- Contexts and expression sections in [01-workflow-authoring.md](./01-workflow-authoring.md)

Hands-on:

- Create a step output with `$GITHUB_OUTPUT`.
- Map it to a job output.
- Consume it through `needs`.
- Add a Markdown report with `$GITHUB_STEP_SUMMARY`.

Checkpoint:

- Explain when to use env vars, step outputs, job outputs, artifacts, and caches.

## Day 4 - Matrix, services, artifacts, and cache

Read:

- Matrix/services sections in [01-workflow-authoring.md](./01-workflow-authoring.md)
- Cache/artifact sections in [06-enterprise-security-optimization.md](./06-enterprise-security-optimization.md)

Hands-on:

- Create a Node or Python matrix across two versions.
- Set `fail-fast: false` and `max-parallel`.
- Upload an artifact on failure.
- Add dependency caching.

Checkpoint:

- Explain how matrix expansion affects cost, troubleshooting, and reruns.

## Day 5 - Reusable workflows deep dive

Read:

- [03-reusable-workflows.md](./03-reusable-workflows.md)

Hands-on:

- Create a reusable workflow with typed inputs.
- Call it from another workflow.
- Pass one secret explicitly.
- Return one output and consume it in a downstream job.

Checkpoint:

- Explain `workflow_call`, `with`, `secrets`, workflow outputs, and job-level `uses`.

## Day 6 - Composite actions deep dive

Read:

- [04-composite-actions.md](./04-composite-actions.md)

Hands-on:

- Create `.github/actions/setup-project/action.yml`.
- Add inputs and outputs.
- Call it from a workflow after `actions/checkout`.
- Move a shell script into the action folder and invoke it with `github.action_path`.

Checkpoint:

- Explain why composite actions do not define `runs-on`, matrices, services, or environments.

## Day 7 - Troubleshooting workflows

Read:

- [05-consuming-and-troubleshooting.md](./05-consuming-and-troubleshooting.md)

Hands-on:

- Intentionally break a workflow input and read the validation error.
- Intentionally fail one matrix job and rerun only that job.
- Upload failure logs as an artifact.

Checkpoint:

- Given a failed run, identify whether the failure is trigger, permission, input, runner, shell, or dependency related.

## Day 8 - Security

Read:

- Security sections in [06-enterprise-security-optimization.md](./06-enterprise-security-optimization.md)

Hands-on:

- Set least-privilege `permissions`.
- Compare PAT-style auth with `GITHUB_TOKEN` and OIDC.
- Rewrite an unsafe inline script to pass event data through env vars.

Checkpoint:

- Explain why `pull_request_target` is dangerous if it checks out and runs PR code.

## Day 9 - Enterprise governance and runners

Read:

- Enterprise and runner sections in [06-enterprise-security-optimization.md](./06-enterprise-security-optimization.md)

Hands-on:

- Sketch an org standardization approach using reusable workflows, starter workflows, and composite actions.
- Decide which workloads use GitHub-hosted vs self-hosted runners.

Checkpoint:

- Explain where enterprise, org, repo, environment, and runner-group controls apply.

## Day 10 - Review and practice

Read:

- [07-quick-reference.md](./07-quick-reference.md)

Practice:

- Take the official practice assessment.
- For every missed question, write which mechanism the question was testing.
- Rebuild from memory:
  - One reusable workflow.
  - One composite action.
  - One `workflow_dispatch` deployment workflow.
  - One matrix CI workflow.

Final checkpoint:

- You should be able to explain the difference between starter workflows, reusable workflows, and composite actions without looking.
- You should be able to choose the right trigger for a scenario.
- You should be able to recognize unsafe token/secrets patterns.
- You should be able to trace outputs across steps, jobs, and reusable workflows.