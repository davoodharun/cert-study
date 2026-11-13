# GH-200: GitHub Actions — Study Guide

Personal study guide aligned to the [official GH-200 skills measured](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) (skills measured as of **January 2026**; page metadata updated **February 2026**).

## How to use this guide

GH-200 tests whether you can design, operate, secure, and govern GitHub Actions automation. It is not just YAML recall: expect scenario questions about which trigger to use, how data moves between steps/jobs/workflows, how reusable components differ, and how to manage Actions at org or enterprise scale.

Because you asked for extra depth, spend the most time on **workflow syntax, trigger events, reusable workflows, and composite actions**.

| Priority | Area | Weight | Why |
|----------|------|--------|-----|
| High | Author and manage workflows | 20-25% | Core YAML, events, jobs, matrices, outputs, artifacts |
| High | Manage GitHub Actions for the enterprise | 20-25% | Policies, runners, secrets, variables, templates, governance |
| High | Author and maintain actions | 15-20% | Composite/JavaScript/Docker actions, metadata, versioning |
| High | Consume and troubleshoot workflows | 15-20% | Logs, reruns, artifacts, templates, reusable workflows |
| Medium | Secure and optimize automation | 10-15% | Permissions, OIDC, trusted actions, caching, cost controls |

**Passing score:** 700 / 1000 (scaled)  
**Official practice/cert page:** [GitHub Actions certification](https://learn.microsoft.com/en-us/credentials/certifications/github-actions/)  
**Exam env:** [exam sandbox](https://aka.ms/GHExamDemo-enu)

### Files in this folder

| File | Contents |
|------|----------|
| [01-workflow-authoring.md](./01-workflow-authoring.md) | Workflow anatomy, jobs, steps, contexts, expressions, matrices, outputs |
| [02-trigger-events-and-syntax.md](./02-trigger-events-and-syntax.md) | Deep dive on `on:`, event filters, `workflow_dispatch`, `workflow_call`, schedules, conditions |
| [03-reusable-workflows.md](./03-reusable-workflows.md) | Reusable workflow design, inputs/secrets/outputs, permissions, versioning, examples |
| [04-composite-actions.md](./04-composite-actions.md) | Composite actions, metadata, inputs/outputs, shell behavior, distribution, examples |
| [05-consuming-and-troubleshooting.md](./05-consuming-and-troubleshooting.md) | Logs, artifacts, reruns, templates, matrix failures, common YAML/debug traps |
| [06-enterprise-security-optimization.md](./06-enterprise-security-optimization.md) | Enterprise governance, runners, secrets/variables, token permissions, OIDC, caching/cost |
| [07-quick-reference.md](./07-quick-reference.md) | Scenario lookup, syntax crib sheet, traps, comparison tables |
| [08-study-plan.md](./08-study-plan.md) | Focused 10-day plan with hands-on labs |

### Official study resources

1. [Automate your workflow with GitHub Actions](https://learn.microsoft.com/en-us/training/paths/github-actions/)
2. [GitHub Actions documentation](https://docs.github.com/actions)
3. [Workflow syntax for GitHub Actions](https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions)
4. [Creating actions](https://docs.github.com/actions/sharing-automations/creating-actions)
5. [Managing GitHub Actions for your enterprise](https://docs.github.com/enterprise-cloud@latest/actions/administering-github-actions)

### Exam domain weights

| Domain | Weight |
|--------|--------|
| Author and manage workflows | 20-25% |
| Consume and troubleshoot workflows | 15-20% |
| Author and maintain actions | 15-20% |
| Manage GitHub Actions for the enterprise | 20-25% |
| Secure and optimize automation | 10-15% |

---

*Source of truth: Microsoft Learn GH-200 study guide. Re-check that page if you sit the exam after a major update.*