# Domain 2: Work with GitHub repositories (10–15%)

---

## Repository structure and key files

Healthy repos advertise how to use and contribute via root (or `.github/`) files:

| File / area | Purpose |
|-------------|---------|
| **README** | First impression: what the project is, how to use/build it |
| **LICENSE** | Legal terms for using/copying the code (critical for OSS) |
| **CONTRIBUTING** | How to contribute (process, style, PR expectations) |
| **CODEOWNERS** | Auto-request reviewers for paths; define ownership of code areas |
| **SECURITY** | How to report vulnerabilities (private disclosure instructions) |
| **`.github/`** | Issue/PR templates, workflows, FUNDING, dependabot config, etc. |

**Exam tip:** SECURITY.md tells people *how to report vulns*; it is not the same as Dependabot or branch protection.

Also recognize:

- **`.gitignore`** — files Git should not track  
- **Issue / PR templates** — structured intake for bugs and changes  

---

## Create, organize, maintain

### Creating and organizing

- Create empty repo or from **template repository**  
- Choose visibility: **public** / **private** / (enterprise) **internal**  
- Use **topics**, descriptions, and organization for discoverability  
- **Branches** isolate work; protect the default branch (see Domain 6)  

### Templates

- **Template repositories** — “Use this template” to start a new repo with predefined structure (not the same as forking)  
- **Issue/PR templates** — guide reporters and contributors  

**Template vs fork:** template = start a *new* unrelated project; fork = copy linked to upstream for contributing back (or customization).

### Adding and managing files

- Via web UI, Desktop, or Git CLI (`add` / `commit` / `push`)  
- **Commits** should have clear messages  
- Large files: Git LFS awareness (foundations level — know it exists for big binaries)  

---

## Insights and visibility features

Know that GitHub provides **repository insights** / metrics such as:

- Traffic, commits, contributors, code frequency  
- **Dependency graph / dependency insights** — what the repo depends on; related to security alerts  
- Stars, watches — social signals and notification levels  
- Feature previews / dashboards — newer metrics UI concepts on the outline  

**Exam:** Insights help maintainers understand adoption, contribution patterns, and dependencies — not for writing code.

---

## Maintenance and collaboration best practices

- Keep default branch green (CI + reviews)  
- Document with README + CONTRIBUTING  
- Use CODEOWNERS for the right reviewers  
- Delete stale branches; use Protect rules  
- Label and close stale issues thoughtfully  
- Prefer PRs over committing straight to `main` for shared repos  

---

## Checkpoint questions

1. LICENSE vs CONTRIBUTING — which is primarily legal?  
2. CODEOWNERS does what when you change owned paths?  
3. Template repository vs fork — which starts an independent new project?  
4. Where do workflow YAML files typically live? (`.github/workflows/`)  
