const guides = [
  {
    title: "AZ-900: Azure Fundamentals",
    files: [
      ["Overview", "az-900/README.md"],
      ["Cloud Concepts", "az-900/01-cloud-concepts.md"],
      ["Architecture, Compute, Network", "az-900/02-architecture-compute-network.md"],
      ["Storage", "az-900/03-storage.md"],
      ["Identity and Security", "az-900/04-identity-security.md"],
      ["Management and Governance", "az-900/05-management-governance.md"],
      ["Quick Reference", "az-900/06-quick-reference.md"],
      ["Study Plan", "az-900/07-study-plan.md"]
    ]
  },
  {
    title: "GH-900: GitHub Foundations",
    files: [
      ["Overview", "gh-900/README.md"],
      ["Git and GitHub Basics", "gh-900/01-git-github-basics.md"],
      ["Repositories", "gh-900/02-repositories.md"],
      ["Collaboration", "gh-900/03-collaboration.md"],
      ["Modern Development", "gh-900/04-modern-development.md"],
      ["Projects", "gh-900/05-projects.md"],
      ["Privacy, Security, Admin", "gh-900/06-privacy-security-admin.md"],
      ["Community", "gh-900/07-community.md"],
      ["Quick Reference", "gh-900/08-quick-reference.md"],
      ["Study Plan", "gh-900/09-study-plan.md"]
    ]
  },
  {
    title: "GH-200: GitHub Actions",
    files: [
      ["Overview", "gh-200/README.md"],
      ["Workflow Authoring", "gh-200/01-workflow-authoring.md"],
      ["Trigger Events and Syntax", "gh-200/02-trigger-events-and-syntax.md"],
      ["Reusable Workflows", "gh-200/03-reusable-workflows.md"],
      ["Composite Actions", "gh-200/04-composite-actions.md"],
      ["Consuming and Troubleshooting", "gh-200/05-consuming-and-troubleshooting.md"],
      ["Enterprise, Security, Optimization", "gh-200/06-enterprise-security-optimization.md"],
      ["Quick Reference", "gh-200/07-quick-reference.md"],
      ["Study Plan", "gh-200/08-study-plan.md"]
    ]
  }
];

const nav = document.querySelector("#nav");
const content = document.querySelector("#content");
const breadcrumb = document.querySelector("#breadcrumb");
const sourceLink = document.querySelector("#source-link");
const search = document.querySelector("#search");
const menuToggle = document.querySelector("#menu-toggle");

const allFiles = guides.flatMap((guide) =>
  guide.files.map(([label, path]) => ({ guide: guide.title, label, path }))
);

marked.use({
  mangle: false,
  headerIds: true
});

function renderNav() {
  nav.innerHTML = guides.map((guide) => {
    const links = guide.files.map(([label, path]) => (
      `<button class="nav-link" type="button" data-path="${path}" data-search="${`${guide.title} ${label} ${path}`.toLowerCase()}">${label}</button>`
    )).join("");

    return `
      <section class="nav-group">
        <h2 class="nav-group-title">${guide.title}</h2>
        ${links}
      </section>
    `;
  }).join("");
}

function findFile(path) {
  return allFiles.find((file) => file.path === path) || allFiles[0];
}

function rewriteMarkdownLinks(container, currentPath) {
  const currentFolder = currentPath.split("/").slice(0, -1).join("/");

  container.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");

    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      return;
    }

    const [rawPath, hash = ""] = href.split("#");
    const normalized = new URL(rawPath, `${window.location.origin}/${currentFolder}/`).pathname.slice(1);

    if (normalized.endsWith(".md")) {
      anchor.href = `#/${normalized}${hash ? `#${hash}` : ""}`;
    }
  });
}

async function loadPage(path) {
  const file = findFile(path);
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.path === file.path);
  });

  breadcrumb.textContent = `${file.guide} / ${file.label}`;
  sourceLink.href = file.path;
  sourceLink.textContent = "Open Markdown";

  try {
    const response = await fetch(file.path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();
    const html = marked.parse(markdown);
    content.innerHTML = DOMPurify.sanitize(html);
    rewriteMarkdownLinks(content, file.path);
    document.title = `${file.label} | Cert Study`;
    window.scrollTo({ top: 0, behavior: "instant" });
  } catch (error) {
    content.innerHTML = `
      <h1>Unable to load page</h1>
      <p>The file <code>${file.path}</code> could not be loaded. Serve the repository over HTTP, for example with <code>python -m http.server 8000</code>.</p>
      <pre><code>${error.message}</code></pre>
    `;
  }
}

function currentPathFromHash() {
  const value = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
  return value || allFiles[0].path;
}

function filterNav(query) {
  const normalized = query.trim().toLowerCase();

  document.querySelectorAll(".nav-group").forEach((group) => {
    let visibleCount = 0;

    group.querySelectorAll(".nav-link").forEach((link) => {
      const isVisible = !normalized || link.dataset.search.includes(normalized);
      link.classList.toggle("hidden", !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    group.classList.toggle("hidden", visibleCount === 0);
  });
}

renderNav();
loadPage(currentPathFromHash());

nav.addEventListener("click", (event) => {
  const link = event.target.closest(".nav-link");
  if (!link) {
    return;
  }

  window.location.hash = `/${link.dataset.path}`;
  document.body.classList.remove("nav-open");
});

window.addEventListener("hashchange", () => loadPage(currentPathFromHash()));
search.addEventListener("input", () => filterNav(search.value));
menuToggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));