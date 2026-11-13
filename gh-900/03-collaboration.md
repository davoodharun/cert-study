# Domain 3: Collaborate using GitHub (10–15%)

---

## Issues, pull requests, and discussions

| Tool | Purpose |
|------|---------|
| **Issues** | Track bugs, tasks, feature requests, questions (work *to do*) |
| **Pull requests (PRs)** | Propose *code* (or file) changes from a branch; review + merge |
| **Discussions** | Forum-style Q&A / ideas / conversations *without* implying code change |

**Exam cues**

- “Track a bug” → Issue  
- “Propose a fix and get review” → Pull request  
- “Ask a design question for the community” → Discussion  

### Linking PRs to issues

- Keywords in PR description: `Fixes #12`, `Closes #12`, `Resolves #12`  
- Merging the PR can **auto-close** the linked issue  
- Cross-linking keeps history and project boards in sync  

### Templates, filters, assignments

- **Issue/PR templates** — consistent fields (repro steps, checklist)  
- **Labels** — categorize (bug, enhancement, good first issue)  
- **Assignees** — who’s responsible  
- **Filters / search** — `is:issue is:open label:bug assignee:@me`  
- **Milestones** — group issues toward a release/date (also Domain 5)  

---

## Notifications

- Stay informed about issues, PRs, CI, mentions  
- **Watch** a repo (all activity / issues only / ignore)  
- **Subscribe** to a specific thread  
- Configure notification delivery (email, web, mobile) and inbox filtering  

**Exam:** Notifications are how you manage workflow attention — configure them so signal > noise.

---

## Gists, Wikis, and GitHub Pages

| Feature | Purpose |
|---------|---------|
| **Gists** | Share snippets or small files (public or secret); mini-repos |
| **Wikis** | Editable documentation wiki attached to a repo |
| **GitHub Pages** | Host static websites from a repo (docs sites, project pages) |

**Exam cues**

- Quick share one script → **Gist**  
- Longer collaborative docs inside the repo → **Wiki**  
- Publish a public static site → **Pages**  

README still lives *in* the repo tree; Wiki is separate wiki store; Pages is *published* site.

---

## Code review basics (ties to PRs)

- Reviewers leave comments, approve, or request changes  
- **Draft PRs** signal “not ready for full review”  
- Required reviews often enforced by **branch protection** (Domain 6)  

---

## Checkpoint questions

1. Issue vs Discussion — which is for tracking work items to close?  
2. What keyword in a PR can auto-close issue #42 on merge?  
3. Gist vs Pages — which hosts a full static website?  
4. Watching a repo vs being assigned to one issue — which is broader?  
