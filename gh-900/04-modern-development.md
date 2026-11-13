# Domain 4: Apply modern development practices (10–15%)

High chance of newer exam items: **Actions**, **Copilot** (including agents / tiers), **Codespaces**, and **github.dev**.

---

## GitHub Actions

**Purpose:** Automate workflows in response to GitHub events (CI/CD, tests, releases, bots).

### Core ideas

| Term | Meaning |
|------|---------|
| **Workflow** | Automated process defined in YAML under `.github/workflows/` |
| **Event / trigger** | What starts it (`push`, `pull_request`, `schedule`, `workflow_dispatch`, etc.) |
| **Job** | Set of steps that run on a runner (can be parallel) |
| **Step** | Individual task (run a command or use an **action**) |
| **Action** | Reusable unit (often from Marketplace) |
| **Runner** | Machine that executes jobs (GitHub-hosted or self-hosted) |

**Exam:** Actions = automation/CI-CD *on GitHub*; not the same as Projects boards or Copilot.

Common uses: build/test on PR, deploy on tag, label issues, scheduled maintenance.

---

## GitHub Copilot

AI pair programmer that suggests code and assists in the IDE / on GitHub.

### Capabilities (foundations level)

- Inline code completions and chat  
- Explain code, generate tests, suggest fixes  
- **Agents / Agent Mode** — more autonomous multi-step assistance (as on the Jan 2026 outline)  
- **Multi-model support** — different underlying models where the product allows  

### Plans / tiers (know differences at a high level)

| Plan | Who / focus |
|------|-------------|
| **Copilot for Individuals** | Personal use (Pro-style individual subscription) |
| **Copilot Business** | Org-managed for companies; policy/admin, IP-oriented controls |
| **Copilot Enterprise** | Larger enterprises; deeper org customization, knowledge, policy |

Also on the security/admin outline: **organization-wide Copilot policy management** — admins enable/restrict Copilot for the org.

**Exam traps:** Copilot ≠ Actions (AI coding help vs workflow automation). Copilot ≠ Codespaces (AI vs cloud dev environment).

---

## GitHub Codespaces

**Cloud development environments** hosted by GitHub — VS Code (or JetBrains options per product) in the browser/desktop, attached to a repo.

### Why use it

- Consistent machine for the team  
- Fast onboarding (“click and code”)  
- Works from underpowered laptops  
- Configurable with **dev containers** |

### Dev containers

- Config (often `.devcontainer/devcontainer.json`) defines tools, extensions, ports, setup scripts  
- Ensures everyone (and Codespaces) gets the same toolchain  

**Setup/customize/use:** create Codespace from repo → edit → commit/push → stop/delete when done (billing awareness: compute while running).

---

## github.dev vs Codespaces

| | **github.dev** | **Codespaces** |
|--|----------------|----------------|
| How | Press `.` on a repo or `github.dev` URL | “Code” → Codespaces |
| What | Lightweight **browser editor** (VS Code web) on the repo | Full **cloud VM** / carefully configured env |
| Compute | No full persistent cloud machine like Codespaces | Dedicated environment; install dependencies, run servers |
| Best for | Quick edits, review, small changes | Real development, builds, long sessions |

**Exam cue:** “Full cloud IDE with custom toolkit” → Codespaces; “Quick web edit without spinning up a full environment” → github.dev.

---

## Checkpoint questions

1. Where do Actions workflow files live?  
2. Name one event that can trigger a workflow.  
3. Individuals vs Business Copilot — which emphasizes org policy/admin?  
4. Dev containers mainly customize which product experience?  
5. github.dev vs Codespaces — which gives a full cloud machine?  
