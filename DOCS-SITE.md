# Documentation site

This repository includes a lightweight documentation site for the AZ-900, GH-900, and GH-200 study guides.

## Run locally

From the repository root:

```powershell
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## How it works

- `index.html` is the site shell.
- `site/app.js` defines the navigation and loads the Markdown files from `az-900/`, `gh-900/`, and `gh-200/`.
- `site/styles.css` controls the layout and reading experience.
- The Markdown files remain the source of truth; edit the study guide files directly.

The site uses browser-loaded Markdown rendering libraries from jsDelivr, so internet access is required for the renderer unless those libraries are vendored locally later.

## GitHub Pages deployment

This repository is public, and GitHub Pages is configured to use GitHub Actions.

The `.github/workflows/pages.yml` workflow tests the quiz, stages only the public
site and study-guide folders, and deploys a Pages artifact. It runs on pushes to
`main` and can also be started manually from the Actions tab.

In the repository's **Settings > Pages > Build and deployment**, select
**GitHub Actions** as the source. Commit and push the site and workflow to `main`;
then check **Actions > Deploy study site to GitHub Pages** for the deployment URL:

<https://davoodharun.github.io/cert-study/>

The deployment job uses the `github-pages` environment and only grants
`pages: write` and `id-token: write` to that job. No personal access token is
needed. Concurrent deployments are serialized without canceling an active one.
If repository or organization rules require environment approval, approve the
pending deployment in Actions.

All assets and guide requests are relative to the site directory. Markdown links
are converted to hash routes, so navigation works both at localhost and under
the `/cert-study/` GitHub Pages project path.

## GH-200 quiz

Select **Practice Quiz** under GH-200, or open `#/gh-200/quiz`.

- 100 original questions cover the five official exam domains: workflows (25),
  consuming/troubleshooting (20), actions (20), enterprise management (23), and
  security/optimization (12).
- Study mode locks each answer after checking and explains every choice.
  Exam practice is untimed and withholds feedback until final submission;
  previous/next navigation preserves selections. Unanswered questions count
  as incorrect, and submission requires confirmation.
- Select all domains or one domain and request 10, 25, 50, or all available
  questions. Sessions are capped at the available bank size, contain no repeats,
  and shuffle both questions and answer choices. All-domain sessions allocate
  questions proportionally to domain coverage, rounded to the requested size.
- Multiple-answer questions require the exact set of correct choices, without
  partial credit. Results include per-domain scores, full explanations, a
  missed-only review filter, and a randomized study retry of missed questions.
- The last ten completed attempts, including per-domain totals, are saved in
  this browser's local storage. No answers or results are sent to a server.
  Clearing browser history removes these records. Storage failures display a
  warning and do not prevent the current session from working.
- In-progress attempts are not persisted. Refreshing or navigating to a study
  guide resets them. Study retries are labeled separately in history.

Question content and source links live in `site/gh-200-questions.js`. Add or
revise original questions there and keep the documented bank counts and tests
in sync. `site/quiz-core.js` contains the randomization and scoring logic;
`site/quiz.js` renders the quiz. The engine can support future exam banks;
AZ-900 and GH-900 do not yet have quizzes.

The question bank was reviewed against the
[official GH-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200)
on November 13, 2026. These are not copied official assessment questions or exam
dumps. Raw quiz percentages do not convert to Microsoft's scaled passing score
and cannot guarantee exam readiness. Combine fresh attempts with hands-on labs
and the official practice assessment.

## Validate changes

With Node.js 22 installed, run the dependency-free tests from the repository root:

```powershell
node --test tests\quiz.test.cjs
node --check site\app.js
node --check site\quiz.js
```

Tests cover bank completeness, domain proportions, randomization, filtering,
exact-match grading, unanswered questions, summaries, and missed-only retries.