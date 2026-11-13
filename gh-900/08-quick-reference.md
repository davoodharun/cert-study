# GH-900 quick reference & trap questions

## Pick the right feature

| Scenario | Likely answer |
|----------|---------------|
| Track a bug / task | **Issue** |
| Propose code changes + review | **Pull request** |
| Open-ended Q&A without a work item | **Discussion** |
| Auto-close issue when fix merges | PR keywords `Fixes` / `Closes` `#n` |
| Format README / issue text | **Markdown** |
| Automate CI/CD on push/PR | **GitHub Actions** |
| AI code suggestions / chat / agents | **GitHub Copilot** |
| Full cloud dev environment | **Codespaces** |
| Quick browser edit (press `.`) | **github.dev** |
| GUI Git without CLI | **GitHub Desktop** |
| Triage on phone | **GitHub Mobile** |
| Kanban / table of work across issues | **GitHub Projects** |
| Group work for a release date | **Milestone** |
| Tag issues (bug/enhancement) | **Label** |
| Legal use terms | **LICENSE** |
| How to contribute | **CONTRIBUTING** |
| Auto-assign path reviewers | **CODEOWNERS** |
| How to report vulns | **SECURITY.md** |
| Share a snippet | **Gist** |
| Repo collaborative docs wiki | **Wiki** |
| Host static site | **GitHub Pages** |
| Require PR + CI on `main` | **Branch protection / rulesets** |
| Repo visible only to collaborators | **Private** |
| Visible to enterprise members only | **Internal** |
| Org-provisioned enterprise identities | **Enterprise Managed Users (EMUs)** |
| Install apps/actions | **Marketplace** |
| Fund maintainers | **GitHub Sponsors** |
| OSS practices inside a company | **InnerSource** |
| Copy to contribute upstream | **Fork** |
| Start new project from starter | **Template repository** |
| Local VCS tool | **Git** |
| Hosting + collaboration platform | **GitHub** |
| Branch → commits → PR → review → merge | **GitHub Flow** |

---

## GitHub Flow (memorize)

1. Branch from default  
2. Commit  
3. Open PR  
4. Review + checks  
5. Merge  
6. Delete branch (hygiene)  

---

## Common traps

1. **Git ≠ GitHub**  
2. **Issue ≠ PR ≠ Discussion**  
3. **Actions ≠ Copilot ≠ Codespaces**  
4. **github.dev ≠ Codespaces** (editor vs full env)  
5. **Fork ≠ Template**  
6. **Sponsors ≠ Marketplace**  
7. **InnerSource ≠ public open source**  
8. **Follow (people) ≠ Star/Watch (repos)**  
9. **Triage can manage issues; Write pushes code**  
10. **Public visibility ≠ LICENSE permission**  
11. **Repository Insights ≠ Project insights**  
12. **Branch protection blocks unsafe pushes to critical branches**  

---

## Permission ladder (repos)

`Read → Triage → Write → Maintain → Admin`

---

## Copilot tiers (one-liners)

- **Individuals** — personal  
- **Business** — company-managed + policies  
- **Enterprise** — largest org feature/admin surface  

---

## Security feature one-liners

| Feature | One-liner |
|---------|-----------|
| 2FA / passkeys | Protect the account |
| Branch protection | Protect the branch |
| Dependabot | Vulnerable dependencies |
| Secret scanning | Leaked secrets in git |
| Code scanning | Vulnerable *code* patterns |
| EMUs | Enterprise-managed users |
