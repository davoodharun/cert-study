# Domain 1: Understand Git and GitHub basics (25–30%)

Largest slice of GH-900. Even if you use Git daily, learn the **exam vocabulary** and GitHub product names.

---

## 1.1 Version control fundamentals

### Purpose and benefits of version control

Version control tracks changes to files over time so teams can:

- Recover previous versions / undo mistakes  
- Work in parallel without overwriting each other  
- See *who* changed *what* and *why* (history + messages)  
- Support code review and release workflows  

**Distributed** VCS (Git): every clone has a full history. Contrast with older centralized systems where the server held the only full repo.

### Git vs GitHub

| | **Git** | **GitHub** |
|--|---------|------------|
| What | Open-source *distributed version control system* | Hosting + collaboration **platform** built around Git |
| Where | Runs locally (and on any host) | github.com / GitHub Enterprise Cloud or Server |
| Provides | Commits, branches, merges, remotes | Issues, PRs, Actions, Packages, Copilot, security, orgs, etc. |

**Exam tip:** Git ≠ GitHub. You can use Git without GitHub; GitHub adds social/collaboration/DevOps features on top of Git repos.

### Key Git concepts

| Concept | Meaning |
|---------|---------|
| **Repository (repo)** | Project + full Git history |
| **Commit** | Snapshot of changes with message, author, parent(s) |
| **Branch** | Movable pointer to a commit; parallel line of work |
| **Clone** | Copy a remote repo (including history) to your machine |
| **Remote** | Named link to another copy (usually `origin` on GitHub) |
| **Push / pull / fetch** | Send commits up / update local with remote / download without merging |
| **Merge** | Combine histories (may create a merge commit) |
| **Working tree / staging** | Files on disk → staged (`git add`) → committed |

**Default branch** is often `main` (legacy `master` still appears in older content).

---

## 1.2 Working with GitHub

### Accounts, organizations, and enterprise

| Entity | Role |
|--------|------|
| **Personal account** | Individual identity; owns personal repos |
| **Organization** | Shared space for teams, repos, policies, billing for a group |
| **Enterprise** | Larger admin boundary across multiple orgs (Enterprise Cloud or Server); centralized policy, SSO, audit, EMUs |

Know you can belong to many orgs; org repos ≠ personal repos for permissions and ownership.

### GitHub Flow (collaboration model)

Lightweight branching model Microsoft/GitHub emphasize:

1. Create a **branch** from the default branch  
2. Make **commits** on that branch  
3. Open a **pull request** (discuss + review)  
4. Review, address feedback, run checks  
5. **Merge** into the default branch  
6. Delete the branch (optional hygiene)  

Contrast (awareness only): Git Flow (release/hotfix branches) is heavier; exam focuses on **GitHub Flow**.

### Markdown

Used across GitHub for readable communication:

- Issues, pull requests, discussions, README, Wikis, some comments  
- Common syntax: headings, lists, links, images, code fences, task lists (`- [ ]`), mentions (`@user`), issue refs (`#123`)

**Exam:** Markdown = formatting for clear written collaboration on GitHub, not a programming language.

### GitHub Desktop and GitHub Mobile

| Tool | When to use |
|------|-------------|
| **GitHub Desktop** | GUI for common Git ops (clone, branch, commit, push, PRs) — great if you prefer UI over CLI |
| **GitHub Mobile** | Triage issues/PRs, notifications, light review on phone/tablet — not a full local Git workstation |

**Exam cue:** “Contribute without remembering Git CLI” → Desktop; “Triage on the go” → Mobile.

---

## Checkpoint questions

1. Is Git the same product as GitHub?  
2. Name the six high-level steps of GitHub Flow.  
3. Personal account vs organization — which owns shared team repos and teams?  
4. Markdown is used where on GitHub (name three places)?  
