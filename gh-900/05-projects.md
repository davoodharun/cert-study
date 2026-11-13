# Domain 5: Manage projects with GitHub (5–10%)

Smaller domain — learn names and purposes, not deep Project v2 power-user tricks.

---

## GitHub Projects

**GitHub Projects** (Projects v2 / “Projects”) is a flexible planning board/table linked to issues and PRs across repos.

### Layout options (awareness)

| Layout | Feel |
|--------|------|
| **Board** | Kanban columns (Todo / In Progress / Done) |
| **Table** | Spreadsheet-like rows and fields |
| **Roadmap** | Timeline-oriented view (when available) |

Projects attach **custom fields** (status, priority, date, iteration) and can span an organization.

**Exam:** Projects = planning/tracking UI; Issues = work items; they work together.

---

## Labels, milestones, workflows

| Feature | Purpose |
|---------|---------|
| **Labels** | Flexible tags on issues/PRs (bug, docs, priority) |
| **Milestones** | Group issues toward a goal/release with optional due date; progress % |
| **Assignees** | Who owns the item |
| **Project workflows** | Automation: e.g. when issue closes → move to Done; when PR added → set status |

Also: **saved replies** — reusable canned responses for reviews/issue triage (streamline communication).

---

## Project insights

- Charts / progress views on project items  
- Track throughput, status distribution, productivity over time  

**Exam:** Project insights help managers/maintainers see progress — distinct from **repository Insights** (traffic, contributors, dependencies).

---

## How pieces fit

```
Issue / PR  ──linked──►  Milestone (release)
     │
     └── also on ►  Project board/table (status fields)
```

Use labels for taxonomy; milestones for release grouping; Projects for team workflow status.

---

## Checkpoint questions

1. Board vs milestone — which is primarily a release/grouping deadline concept?  
2. Saved replies help with what?  
3. Are Projects limited to a single repository? (Typically can be org-level / multi-repo.)  
4. Repository Insights vs Project insights — which tracks board progress/productivity?  
