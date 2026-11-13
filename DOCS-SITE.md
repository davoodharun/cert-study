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