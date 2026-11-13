(function (root) {
  "use strict";

  const domains = {
    workflows: { title: "Author and manage workflows", study: "gh-200/01-workflow-authoring.md" },
    troubleshooting: { title: "Consume and troubleshoot workflows", study: "gh-200/05-consuming-and-troubleshooting.md" },
    actions: { title: "Author and maintain actions", study: "gh-200/04-composite-actions.md" },
    enterprise: { title: "Manage GitHub Actions for the enterprise", study: "gh-200/06-enterprise-security-optimization.md" },
    security: { title: "Secure and optimize automation", study: "gh-200/06-enterprise-security-optimization.md" }
  };
  const references = {
    syntax: "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax",
    events: "https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows",
    commands: "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands",
    contexts: "https://docs.github.com/en/actions/reference/workflows-and-actions/contexts",
    reuse: "https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows",
    services: "https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers",
    matrix: "https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations",
    artifacts: "https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/storing-and-sharing-data-from-a-workflow",
    cache: "https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows",
    runs: "https://docs.github.com/en/actions/how-tos/manage-workflow-runs",
    templates: "https://docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates",
    metadata: "https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax",
    custom: "https://docs.github.com/en/actions/sharing-automations/creating-actions",
    releases: "https://docs.github.com/en/actions/sharing-automations/creating-actions/releasing-and-maintaining-actions",
    runners: "https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners",
    groups: "https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/manage-access",
    hosted: "https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners",
    policies: "https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization",
    secrets: "https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets",
    variables: "https://docs.github.com/en/actions/reference/workflows-and-actions/variables",
    environments: "https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments",
    token: "https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication",
    hardening: "https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions",
    oidc: "https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect",
    attestations: "https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations",
    api: "https://docs.github.com/en/rest/actions"
  };

  function q(id, domain, topic, prompt, correct, options, reference, code = "") {
    return {
      id, domain, topic, prompt, code, reference: references[reference],
      choices: options.map(([text, explanation], index) => ({
        id: `${id}-${index}`, text, explanation, correct: correct.includes(index)
      }))
    };
  }

  const questions = [
    q("w01", "workflows", "Branch and path filters",
      "A push workflow uses the configuration below. Which push triggers it?", [0], [
        ["A push to main changing src/app.js", "Both the branch and path filters match."],
        ["A push to main changing only README.md", "The branch matches, but the path filter does not."],
        ["A push to feature changing src/app.js", "The path matches, but the branch filter does not."],
        ["Every push to main regardless of files", "Branch and path filters are combined, not alternatives."]
      ], "events", "on:\n  push:\n    branches: [main]\n    paths: ['src/**']"),
    q("w02", "workflows", "Pull request refs",
      "You want CI when a pull request targets main. Which filter belongs under pull_request?", [1], [
        ["branches: [feature/**], because it filters the source branch", "Pull request branch filters match the target/base branch."],
        ["branches: [main], because it filters the target branch", "The base branch determines whether this branch filter matches."],
        ["tags: [main], because a PR creates a tag", "Pull request events do not create tags; tags are not this filter."],
        ["paths: [main], because paths means branch names", "Paths filters changed files, not branches."]
      ], "events"),
    q("w03", "workflows", "Scheduled workflows",
      "A nightly maintenance workflow must run from the default branch. Which two facts should guide the design?", [0, 2], [
        ["Scheduled runs use the latest commit on the default branch", "The workflow must exist on the default branch for scheduled events."],
        ["Cron guarantees execution at the exact requested second", "Scheduled runs can be delayed or dropped during heavy load."],
        ["Cron schedules are interpreted in UTC", "Translate local maintenance times to UTC cron expressions."],
        ["A schedule runs separately on every branch", "Schedules do not automatically fan out across branches."]
      ], "events"),
    q("w04", "workflows", "Manual inputs",
      "A workflow_dispatch input dry-run is type boolean. How should a condition read its boolean value?", [0], [
        ["Use inputs.dry-run", "The inputs context preserves the boolean type."],
        ["Use github.event.inputs.dry-run as a boolean without conversion", "The event inputs context presents values as strings."],
        ["Read secrets.dry-run", "Dispatch inputs are not automatically stored as secrets."],
        ["Read matrix.dry-run without declaring a matrix", "The matrix context exists for declared matrix values."]
      ], "contexts"),
    q("w05", "workflows", "External events",
      "An external inventory system must trigger a workflow with custom JSON data. Which event is designed for this?", [2], [
        ["workflow_call", "This enables a workflow to be invoked by another workflow job."],
        ["pull_request_review", "This concerns review activity, not arbitrary external notifications."],
        ["repository_dispatch", "An API dispatch can supply an event_type and client_payload."],
        ["schedule", "Cron does not deliver the external system's custom event payload."]
      ], "events"),
    q("w06", "workflows", "Reusable workflow contract",
      "Which two elements define a reusable workflow's callable interface?", [0, 3], [
        ["on.workflow_call.inputs with supported types", "Reusable workflow inputs declare string, number, or boolean values."],
        ["runs.using: composite at the workflow root", "That is action metadata, not a reusable workflow contract."],
        ["workflow_dispatch alone", "Manual dispatch does not enable calls from another workflow."],
        ["on.workflow_call.secrets for explicitly mapped secrets", "The caller can map secrets to this declared interface."]
      ], "reuse"),
    q("w07", "workflows", "Job dependencies",
      "The test job must finish successfully before deploy runs. Which configuration directly expresses this?", [1], [
        ["Place deploy after test in the YAML file", "Job declaration order does not establish an execution dependency."],
        ["Set needs: test on deploy", "Needs establishes a dependency; success is the default condition."],
        ["Set steps.test on deploy", "There is no such job dependency syntax."],
        ["Set strategy.fail-fast: true on deploy", "Fail-fast manages failures within a matrix, not this dependency."]
      ], "syntax"),
    q("w08", "workflows", "Failure conditions",
      "A report job needs build and test. It must run even if one dependency fails or is skipped. Which job condition fits?", [2], [
        ["if: success()", "This excludes failed or skipped dependency paths."],
        ["if: github.ref == 'main'", "This checks a ref, not dependency status, and the full ref differs."],
        ["if: always()", "Always overrides the implicit success condition, including skipped dependencies."],
        ["continue-on-error: true", "That controls failure handling for execution, not whether dependencies permit starting."]
      ], "syntax"),
    q("w09", "workflows", "Step outputs",
      "A Bash step with id: version calculates a version. How can later steps read steps.version.outputs.release?", [0], [
        ['Append release=1.2.3 to "$GITHUB_OUTPUT"', "The output file exposes named outputs for that step."],
        ['Append release=1.2.3 to "$GITHUB_ENV"', "This creates an environment variable for later steps, not a step output."],
        ["Print release=1.2.3 to standard output only", "Ordinary log text does not define an output."],
        ["Set a YAML anchor named release", "An anchor reuses YAML; it does not publish runtime values."]
      ], "commands"),
    q("w10", "workflows", "Environment files",
      "What happens after a step appends COLOR=green to GITHUB_ENV?", [3], [
        ["Every job immediately receives COLOR", "Environment files are scoped to the current job's subsequent steps."],
        ["The writing step automatically sees the new value in its existing shell", "It needs a shell assignment too if it wants the value immediately."],
        ["The repository's configuration variables are updated", "GITHUB_ENV does not modify repository settings."],
        ["Subsequent steps in the same job can read COLOR", "The runner applies the environment file between steps."]
      ], "commands"),
    q("w11", "workflows", "Cross-job outputs",
      "The package job exposes a step output as a job output. Which expression reads it from a job with needs: package?", [1], [
        ["steps.package.outputs.version", "Steps context refers to steps in the current job."],
        ["needs.package.outputs.version", "Needs exposes outputs of dependency jobs."],
        ["env.package.version", "Environment variables do not automatically cross job boundaries."],
        ["github.outputs.package.version", "The github context does not provide this output structure."]
      ], "contexts"),
    q("w12", "workflows", "Matrix expansion",
      "How many jobs does this matrix create?", [2], [
        ["2", "The two dimensions form a Cartesian product before exclusions."],
        ["3", "There are initially four combinations, not three."],
        ["4", "Two OS values times two Node values gives four jobs."],
        ["6", "There are only four combinations in this configuration."]
      ], "matrix", "strategy:\n  matrix:\n    os: [ubuntu-latest, windows-latest]\n    node: [20, 22]"),
    q("w13", "workflows", "Matrix exclusions",
      "How many variants remain with the matrix below?", [0], [
        ["3", "One specific combination is removed from the four combinations."],
        ["2", "Exclude removes only the matching OS/Node pair, not an entire axis."],
        ["4", "The matching exclude entry removes one generated combination."],
        ["0", "An exclusion does not disable unrelated variants."]
      ], "matrix", "matrix:\n  os: [ubuntu-latest, windows-latest]\n  node: [20, 22]\n  exclude:\n    - os: windows-latest\n      node: 20"),
    q("w14", "workflows", "Matrix includes",
      "What does this matrix include entry do?", [1], [
        ["Adds a third standalone job unconditionally", "This entry can merge into the existing matching combination."],
        ["Adds experimental: true to the Node 22 combination", "It augments the combination without overwriting its original node value."],
        ["Replaces both original Node versions with 22", "Include does not remove the original Node 20 combination."],
        ["Sets every variant to experimental: true", "The node: 22 value restricts which original combination can be augmented."]
      ], "matrix", "matrix:\n  node: [20, 22]\n  include:\n    - node: 22\n      experimental: true"),
    q("w15", "workflows", "Matrix controls",
      "You want all matrix variants to finish collecting diagnostics, but at most two should run simultaneously. Which two settings fit?", [0, 2], [
        ["strategy.fail-fast: false", "This avoids canceling sibling matrix jobs after a failure."],
        ["strategy.fail-fast: true", "This can cancel queued and running matrix siblings."],
        ["strategy.max-parallel: 2", "This caps concurrent execution within the matrix."],
        ["timeout-minutes: 2", "This limits duration, not simultaneous variants."]
      ], "matrix"),
    q("w16", "workflows", "Service container networking",
      "A job runs inside a container and declares a PostgreSQL service named postgres. What hostname should it normally use?", [2], [
        ["localhost", "Inside the job container, localhost refers to that container itself."],
        ["github.com", "The service runs locally on the runner's container network."],
        ["postgres", "Service labels are hostnames on the shared Docker network."],
        ["The pull request author's hostname", "Contributor identity has no relation to service DNS."]
      ], "services"),
    q("w17", "workflows", "Service readiness",
      "Database tests intermittently start before a service is ready. What is the most robust workflow-level remedy?", [0], [
        ["Configure an appropriate container health check", "Readiness checks let the runner wait for the service to become healthy."],
        ["Always sleep for exactly one second", "A fixed short delay does not establish readiness."],
        ["Use continue-on-error on the tests", "This hides the symptom without making the service ready."],
        ["Add the database password to the matrix", "Matrix variations do not implement a readiness check."]
      ], "services"),
    q("w18", "workflows", "Context selection",
      "A step needs the runner OS and the workflow's triggering event name. Which two context expressions fit?", [1, 3], [
        ["secrets.os", "Secrets is a configured secret store, not runner metadata."],
        ["runner.os", "The runner context describes the execution host."],
        ["steps.event_name", "Steps exposes step outcomes and outputs, not trigger metadata."],
        ["github.event_name", "The github context identifies the triggering event."]
      ], "contexts"),
    q("w19", "workflows", "Dynamic matrices",
      "A setup job outputs matrix as a JSON string. How should the dependent job turn it into a matrix object?", [0], [
        ["strategy.matrix: ${{ fromJSON(needs.setup.outputs.matrix) }}", "Job outputs are strings; fromJSON reconstructs the structured matrix."],
        ["strategy.matrix: ${{ toJSON(needs.setup.outputs.matrix) }}", "ToJSON serializes the string rather than parsing it into an object."],
        ["strategy.matrix: ${{ secrets.matrix }}", "No matrix secret was defined, and strings still need parsing."],
        ["strategy.matrix: ${{ steps.setup.outputs.matrix }}", "The setup step is in another job; use the needs context."]
      ], "matrix"),
    q("w20", "workflows", "Job summaries",
      "Where should a step write a Markdown test report so it appears in the workflow run summary?", [2], [
        ["GITHUB_OUTPUT", "This publishes output values, not the rich summary report."],
        ["GITHUB_ENV", "This configures subsequent steps' environment variables."],
        ["GITHUB_STEP_SUMMARY", "Appending Markdown here contributes to the job summary."],
        ["action.yml", "Action metadata is not the workflow run's report destination."]
      ], "commands"),
    q("w21", "workflows", "Artifact transfer",
      "A build job produces dist/ and deploy needs those exact files on a different hosted runner after build succeeds. Which two elements should you use?", [1, 3], [
        ["A shell export in build", "An export cannot transfer files to a different job's machine."],
        ["Upload an artifact in build and download it in deploy", "Artifacts persist run files and support cross-job transfer."],
        ["Assume both jobs share the same workspace", "Separate hosted jobs do not share the filesystem."],
        ["Set needs: build on deploy", "This ensures the producing job completes successfully before the artifact is consumed."]
      ], "artifacts"),
    q("w22", "workflows", "YAML reuse",
      "A repeated environment mapping uses an anchor &shared and an alias *shared in the same workflow. What does the alias do?", [0], [
        ["Reuses the anchored YAML value within that document", "Anchors and aliases reduce duplication in one YAML file."],
        ["Invokes a separately versioned reusable workflow", "Reusable workflows are invoked with a job-level uses reference."],
        ["Copies runtime environment values from a previous job", "YAML reuse is not cross-job runtime data transfer."],
        ["Downloads a Marketplace action", "An alias does not resolve an action repository."]
      ], "syntax"),
    q("w23", "workflows", "Concurrency",
      "New commits should cancel obsolete CI runs for the same branch, without canceling other branches. Which design fits?", [3], [
        ["A single constant concurrency group for all branches", "A constant group causes unrelated branches to compete."],
        ["max-parallel: 1 without a matrix", "Matrix parallelism is not cross-run cancellation."],
        ["timeout-minutes: 1", "Timeouts do not associate old runs with a newer branch run."],
        ["Use a workflow-and-ref concurrency group with cancel-in-progress: true", "Including the workflow and ref isolates cancellation to the desired run stream."]
      ], "syntax"),
    q("w24", "workflows", "Reusable outputs",
      "A caller needs a value from a reusable workflow's internal step. Which output chain is required?", [1], [
        ["Step output directly becomes every caller environment variable", "Outputs require explicit mappings and do not become env automatically."],
        ["Step output to job output to workflow_call output", "The reusable workflow exposes job outputs through its callable output interface."],
        ["GITHUB_ENV to repository variable to caller secret", "Environment files neither configure repository variables nor publish secrets."],
        ["Only add an id to the caller's job", "An id does not expose the callee's internal step outputs."]
      ], "reuse"),
    q("w25", "workflows", "Authoring and validation",
      "A workflow author wants help catching invalid keys before a push and monitoring failures afterward. Which tool is purpose-built for this in VS Code?", [0], [
        ["The GitHub Actions extension with schema completion and validation", "It assists workflow authoring and provides Actions integration."],
        ["A CSV formatter alone", "CSV formatting cannot validate workflow YAML semantics."],
        ["Disabling repository Actions", "Disabling execution does not provide workflow authoring assistance."],
        ["Renaming the workflow to action.yml", "Action metadata and workflow configuration have different schemas."]
      ], "syntax"),

    q("t01", "troubleshooting", "Run diagnostics",
      "A matrix workflow fails only on Windows with Node 22. What is the best first investigation?", [1], [
        ["Rerun every historical run without inspecting them", "Blind reruns do not isolate the failing variant's cause."],
        ["Open that matrix job's failed step logs and compare successful variants", "The variant-specific logs reveal platform/runtime differences."],
        ["Immediately remove Windows from all workflows", "This abandons coverage before identifying the cause."],
        ["Increase repository secret scope to all repositories", "Secret scope is not evidence for this platform-specific failure."]
      ], "runs"),
    q("t02", "troubleshooting", "Debug logging",
      "Normal logs are insufficient. Which two configuration names enable additional GitHub Actions diagnostics when set to true?", [0, 2], [
        ["ACTIONS_STEP_DEBUG", "This enables debug messages for step execution."],
        ["GITHUB_LOG_VERBOSE", "This is not a supported Actions debug logging control."],
        ["ACTIONS_RUNNER_DEBUG", "This enables additional runner diagnostic logging."],
        ["MATRIX_DEBUG_ALL", "This does not enable GitHub Actions diagnostics."]
      ], "runs"),
    q("t03", "troubleshooting", "Rerun identity",
      "You rerun an older workflow after new commits reach the branch. Which commit and ref does the rerun use?", [2], [
        ["Always the branch's newest commit", "A rerun is tied to the original run's SHA and ref."],
        ["A new merge generated from the latest default branch", "A rerun does not automatically recompute a new trigger revision."],
        ["The original run's GITHUB_SHA and GITHUB_REF", "Rerunning reproduces the original event's commit and ref."],
        ["The rerunning user's local working tree", "Local uncommitted files are not workflow rerun inputs."]
      ], "runs"),
    q("t04", "troubleshooting", "Selective reruns",
      "One matrix job failed due to a transient download; the others passed. What is the most targeted recovery?", [0], [
        ["Rerun the failed job using the run's rerun controls", "GitHub supports rerunning failed or specific jobs."],
        ["Delete the workflow file and recreate it", "This is unnecessary for a transient execution failure."],
        ["Force-push a rewrite of all passing jobs", "Passing job definitions do not need to change."],
        ["Set every step to continue-on-error permanently", "That would conceal future real failures."]
      ], "runs"),
    q("t05", "troubleshooting", "Skipped dependencies",
      "Deploy has needs: test and no explicit status condition. Test fails and deploy is skipped. What explains this?", [1], [
        ["YAML jobs always run alphabetically", "Job order is governed by dependencies, not names."],
        ["Dependent jobs require success by default", "A failed dependency prevents default execution of deploy."],
        ["Deploy must be renamed to deployment", "Job identifiers are chosen by the author."],
        ["The workflow must have two separate on keys", "Duplicate trigger keys do not resolve dependency status."]
      ], "syntax"),
    q("t06", "troubleshooting", "Optional failures",
      "A step has continue-on-error: true and fails. Which two step context values describe it?", [0, 3], [
        ["steps.<id>.outcome is failure", "Outcome records the result before continue-on-error handling."],
        ["steps.<id>.outcome is success", "The underlying execution still failed."],
        ["steps.<id>.conclusion is failure", "Continue-on-error changes the final step conclusion."],
        ["steps.<id>.conclusion is success", "Conclusion reflects the tolerated failure after continue-on-error."]
      ], "contexts"),
    q("t07", "troubleshooting", "Disabled versus deleted",
      "You want to pause a noisy workflow without removing its YAML definition. What should you do?", [2], [
        ["Delete its source file", "Deleting removes the versioned definition rather than just pausing it."],
        ["Delete one past workflow run", "Deleting a run does not stop new trigger events."],
        ["Disable the workflow", "Disabling prevents execution while retaining its definition."],
        ["Remove only its status badge", "Badges display status; they do not control execution."]
      ], "runs"),
    q("t08", "troubleshooting", "Artifacts in the UI",
      "Tests uploaded a report artifact successfully. Where should a collaborator with appropriate access look for it?", [0], [
        ["The completed workflow run's artifacts section", "Artifacts are attached to the run and can be downloaded there."],
        ["The repository Releases page automatically", "Upload-artifact does not create a release asset."],
        ["The author's local Downloads directory", "The runner does not upload artifacts into a user's local filesystem."],
        ["The repository secrets page", "Secrets settings do not store downloadable reports."]
      ], "artifacts"),
    q("t09", "troubleshooting", "Artifact expiration",
      "A link to an old workflow artifact no longer works after its retention window. What is the likely explanation?", [1], [
        ["The artifact became a branch", "Retention never converts an artifact into source control."],
        ["The artifact expired and was deleted according to retention policy", "Stored artifacts are not permanent when retention expires."],
        ["The user must rerun checkout to decrypt it", "Checkout does not recover deleted artifacts."],
        ["The original file path is now a repository secret", "File paths do not migrate to secrets after expiration."]
      ], "artifacts"),
    q("t10", "troubleshooting", "REST automation",
      "An operations tool needs to list runs, obtain logs, and remove expired artifacts without using the browser. What should it use?", [3], [
        ["Only the Git commit API", "Commit endpoints do not manage workflow execution records."],
        ["YAML anchors", "Anchors reuse configuration and do not query run records."],
        ["GITHUB_STEP_SUMMARY as a remote API", "The summary file is a runner-local report interface."],
        ["The GitHub Actions REST API with appropriate authentication", "Actions endpoints expose runs, logs, and artifacts programmatically."]
      ], "api"),
    q("t11", "troubleshooting", "Starter workflows",
      "A repository creates a workflow from an organization starter template. The template changes next week. What happens to the created workflow?", [0], [
        ["It remains an independent copy until someone updates it", "Starter workflows provide copied scaffolding, not live inheritance."],
        ["It automatically changes to the new template", "Template edits do not rewrite existing repository workflows."],
        ["It turns into a composite action", "Its type does not change because the source template changed."],
        ["GitHub disables it until the template owner approves it", "Template edits do not impose this automatic approval process."]
      ], "templates"),
    q("t12", "troubleshooting", "Choosing reusable components",
      "A central CI definition must remain versioned and callable by many repositories, including multiple jobs. Which option fits?", [2], [
        ["A copied starter workflow only", "A copy becomes independently maintained instead of centrally invoked."],
        ["A composite action with its own jobs", "Composite actions encapsulate steps and cannot define their own jobs."],
        ["A reusable workflow invoked with a pinned reference", "It can define multiple jobs while callers choose a version."],
        ["A workflow status badge", "A badge displays status rather than providing execution logic."]
      ], "reuse"),
    q("t13", "troubleshooting", "Missing local action",
      "A step uses ./.github/actions/check but says action.yml was not found. The path is correct in the repository. What is likely missing?", [1], [
        ["A workflow_dispatch input named action", "Dispatch inputs do not download local repository files."],
        ["Checkout before invoking the local action", "The local action's files must first be present in the workspace."],
        ["An enterprise-level production environment", "Environments do not populate the checked-out workspace."],
        ["A Docker container for every composite action", "Composite actions do not require their own Docker container."]
      ], "custom"),
    q("t14", "troubleshooting", "Fork secrets",
      "A pull_request workflow from a fork cannot access a repository deployment secret. What is the safest interpretation?", [0], [
        ["This is an intentional trust-boundary restriction", "Repository secrets are normally withheld from fork pull request workflows."],
        ["Secrets are automatically uppercase only on forks", "Case conversion is not the cause of the access restriction."],
        ["A cache miss erased the repository secret", "Caches do not manage repository secret settings."],
        ["Run the fork's code with pull_request_target and expose the secret", "Privileged execution of untrusted code defeats the protection."]
      ], "secrets"),
    q("t15", "troubleshooting", "Cache partial hits",
      "The primary cache key misses, but a restore-key prefix finds a cache. What should you expect?", [3], [
        ["cache-hit is true because any restore counts as exact", "Cache-hit is true only for an exact primary-key match."],
        ["The restored dependencies are guaranteed to match the new lockfile", "A prefix match can restore older dependency state."],
        ["The job must fail because restore-keys are invalid", "Fallback restore keys are a supported cache feature."],
        ["A fallback cache is restored; installation should reconcile dependencies", "A partial match speeds setup but is not an exact-key hit."]
      ], "cache"),
    q("t16", "troubleshooting", "Pending checks",
      "A required CI workflow is skipped because its path filter does not match. Why might a PR remain blocked?", [1], [
        ["The path filter grants write access to every user", "Filters control triggering, not repository authorization."],
        ["The associated required check can remain pending", "A workflow skipped by filters may not produce the required completion check."],
        ["The workflow automatically produces a successful deployment", "A skipped workflow does not guarantee a successful required check."],
        ["The PR changes its base branch to satisfy the filter", "Workflow filters do not modify pull request branches."]
      ], "syntax"),
    q("t17", "troubleshooting", "Production waiting",
      "A deploy job shows Waiting while build has passed. The job uses a protected production environment with required reviewers. What should you inspect?", [2], [
        ["Whether build has an extra YAML anchor", "An anchor is unrelated to an environment review gate."],
        ["Whether the artifact is a Git branch", "Artifact type does not explain a pending environment approval."],
        ["The pending environment review and other deployment protection rules", "The job cannot proceed until its protection requirements are satisfied."],
        ["Whether the repository title contains production", "Repository naming does not approve deployment."]
      ], "environments"),
    q("t18", "troubleshooting", "Runner queue",
      "A job requiring [self-hosted, linux, gpu] stays queued. What is the best first check?", [0], [
        ["An online, idle, authorized runner matches every requested label", "All labels and access policy must match an available runner."],
        ["An arbitrary runner matches at least one label", "A single matching label is insufficient."],
        ["The branch contains a file named gpu", "Runner selection does not inspect such filenames."],
        ["The workflow has an artifact named linux", "Artifact names do not select runners."]
      ], "runners"),
    q("t19", "troubleshooting", "Alias interpretation",
      "When debugging a step's env: *build-env, how should you determine the variables it receives?", [1], [
        ["Read only the last successful job's environment file", "The alias references YAML configuration, not a previous run's environment."],
        ["Find the &build-env anchor and inspect its mapping plus applicable env scopes", "Expand the alias mentally and account for workflow/job/step environment scope."],
        ["Assume the alias fetches organization secrets", "An alias does not imply a secret lookup."],
        ["Treat every alias as an invalid workflow", "Supported YAML anchors and aliases can be used for configuration reuse."]
      ], "syntax"),
    q("t20", "troubleshooting", "HTTP authorization failures",
      "A package-publishing step gets a permission-denied response with GITHUB_TOKEN. What should you investigate before replacing it with a broad PAT?", [0, 2], [
        ["The publishing job's packages permission", "Publishing commonly needs packages: write, with appropriate package access."],
        ["Whether the shell uses a longer sleep", "A delay does not grant missing authorization."],
        ["Package access rules and restrictions from the triggering event", "Package authorization and fork/event token restrictions can both limit access."],
        ["Whether the workflow title is Publish", "Display names do not grant API permission."]
      ], "token"),

    q("a01", "actions", "Action type selection",
      "You need to package several setup steps that execute on the caller's existing runner. Which action type is the simplest fit?", [0], [
        ["Composite", "Composite actions combine run and uses steps on the caller's runner."],
        ["A reusable workflow with a mandatory new runner for each step", "Reusable workflows operate at job level; separate runners per step are unnecessary."],
        ["A Docker action exclusively because all actions require Docker", "Composite and JavaScript actions do not require a Docker action."],
        ["An organization starter workflow only", "A template copies a workflow rather than encapsulating a callable step."]
      ], "custom"),
    q("a02", "actions", "Composite boundaries",
      "Which two requirements indicate a reusable workflow rather than a composite action?", [1, 3], [
        ["A sequence of shell commands on one runner", "This is a natural use case for a composite action."],
        ["Multiple jobs with independent runner selections", "Reusable workflows can define jobs; composite actions cannot."],
        ["An action step that calls another action", "Composite steps can use other actions."],
        ["A deployment job with its own protected environment", "Environments are configured at the workflow job boundary."]
      ], "reuse"),
    q("a03", "actions", "Metadata file",
      "Which filename describes an action's name, inputs, outputs, and execution configuration?", [2], [
        ["package-lock.yml only", "A dependency lockfile is not GitHub action metadata."],
        ["workflow_call.json", "Reusable workflow events are not defined in this invented file."],
        ["action.yml or action.yaml", "These are the recognized metadata filenames."],
        ["CODEOWNERS only", "Code ownership rules do not describe action execution."]
      ], "metadata"),
    q("a04", "actions", "Composite shells",
      "A composite action contains a run step. Which accompanying setting is required for that step?", [0], [
        ["shell", "Composite run steps must specify the shell to execute the command."],
        ["runs-on", "Runner selection belongs to the caller workflow job."],
        ["on: push", "Action metadata does not declare workflow triggers."],
        ["needs", "Job dependencies cannot be defined on a composite run step."]
      ], "metadata"),
    q("a05", "actions", "Composite inputs",
      "A composite action declares an input named target. How should an internal step read it?", [1], [
        ["Assume INPUT_TARGET is automatically injected for composite actions", "Composite inputs do not automatically receive INPUT_ environment variables."],
        ["Use inputs.target, optionally mapped to a quoted environment variable", "The inputs context is the explicit supported interface."],
        ["Use needs.target.outputs.value without a dependency job", "This context is for dependency job outputs, not action inputs."],
        ["Use github.event.inputs.target for every caller event", "The event payload is not the composite action's input contract."]
      ], "metadata"),
    q("a06", "actions", "Composite outputs",
      "Which configuration exposes an internal composite step's result to the caller?", [3], [
        ["Only print the result in the logs", "Log messages are not declared output values."],
        ["Declare workflow_call.outputs in action.yml", "That interface belongs to reusable workflows."],
        ["Add runs-on to outputs", "Runner selection is not an output mapping."],
        ["Map outputs.<name>.value to steps.<id>.outputs.<name>", "The internal step writes GITHUB_OUTPUT; metadata exposes that value."]
      ], "metadata"),
    q("a07", "actions", "Action-relative files",
      "A composite action ships scripts/check.sh. The caller's working directory may differ. How should it locate that script?", [0], [
        ["Resolve it relative to github.action_path", "The action path points to the installed action's own directory."],
        ["Assume it always lives at the caller workspace root", "The caller's repository root need not be the action's directory."],
        ["Use the PR author's home directory", "That directory is not part of the runner's action installation."],
        ["Use GITHUB_OUTPUT as the script directory", "That variable points to a step output file."]
      ], "contexts"),
    q("a08", "actions", "JavaScript portability",
      "You need an action implemented in JavaScript that can run on Linux, Windows, and macOS hosted runners. Which design fits?", [2], [
        ["A Docker container action with automatic native Windows support", "Docker container actions require a Linux runner."],
        ["A shell-only action whose script assumes Linux paths everywhere", "Linux-specific paths undermine cross-platform portability."],
        ["A JavaScript action using a supported Node runtime and portable APIs", "JavaScript actions can execute across those runner operating systems."],
        ["A Dockerfile placed in an organization variables store", "Variables do not define or distribute container actions."]
      ], "custom"),
    q("a09", "actions", "JavaScript distribution",
      "Your JavaScript action imports @actions/core. How should you make dependencies available when another repository uses it?", [1], [
        ["Assume every caller already installed its node_modules", "The caller is not responsible for installing the action's dependencies."],
        ["Ship a bundled entry point or the required runtime dependencies", "The distributed action must contain the code it needs to execute."],
        ["Put package.json in a repository secret", "Secrets do not supply installed JavaScript packages."],
        ["Only commit an empty lockfile", "A lockfile by itself does not contain executable dependencies."]
      ], "custom"),
    q("a10", "actions", "Failure signaling",
      "A JavaScript action detects a validation error and must fail clearly with an explanatory message. What is appropriate?", [0], [
        ["Use @actions/core setFailed with the error message", "SetFailed emits an error and marks the action's process as failed."],
        ["Log success and return zero", "That incorrectly reports the validation failure as success."],
        ["Write the message only to GITHUB_ENV", "An environment variable does not fail the action."],
        ["Rename the action after execution", "Metadata naming does not signal an execution failure."]
      ], "custom"),
    q("a11", "actions", "Docker action runtime",
      "Which runner requirement applies to a Docker container action?", [3], [
        ["It works on all Windows runners without Docker configuration", "Container actions are not native Windows action execution."],
        ["It must always run on macOS", "Docker container actions require Linux, not macOS."],
        ["It cannot run on a GitHub-hosted runner", "Linux GitHub-hosted runners support container actions."],
        ["It needs a Linux runner with Docker available", "Self-hosted execution also requires appropriate Docker installation."]
      ], "custom"),
    q("a12", "actions", "Docker metadata",
      "An action builds its execution image from a Dockerfile in its repository. Which metadata describes this?", [1], [
        ["runs: { using: composite, image: Dockerfile }", "Composite metadata uses steps, not a Docker image execution configuration."],
        ["runs: { using: docker, image: Dockerfile }", "This tells GitHub to build and run the Docker action image."],
        ["on: { docker: Dockerfile }", "Action metadata does not use workflow trigger syntax."],
        ["strategy: { image: Dockerfile }", "Strategy is a workflow job configuration, not Docker action metadata."]
      ], "metadata"),
    q("a13", "actions", "Input enforcement",
      "A custom action marks an input required: true. It must reject missing or malformed values reliably. What else should its implementation do?", [0], [
        ["Validate presence and format and report a clear failure", "Metadata alone is not a substitute for implementation-level validation."],
        ["Assume required metadata validates every input format", "Required metadata does not enforce arbitrary business rules or formats."],
        ["Treat an empty value as success without notification", "This hides invalid configuration from callers."],
        ["Convert every input into a repository secret", "Input validation does not require reconfiguring repository secrets."]
      ], "metadata"),
    q("a14", "actions", "Caller workspace",
      "A composite action's run step has no working-directory. Where does it normally run?", [2], [
        ["Always inside the action's own directory", "Use action_path when accessing files shipped with the action."],
        ["Inside the organization's .github template directory", "Template distribution does not determine the caller's working directory."],
        ["The caller job's working directory, normally its workspace", "Composite steps execute in the caller's job context."],
        ["Inside a new VM created for each composite step", "Composite steps use the caller's existing runner."]
      ], "custom"),
    q("a15", "actions", "Publishing choices",
      "Which two statements about action distribution are correct?", [0, 3], [
        ["An action can be consumed from a repository without a Marketplace listing", "A uses repository reference does not require Marketplace publication."],
        ["Every private action must first become publicly listed", "Private sharing can be configured without public Marketplace distribution."],
        ["A Marketplace listing means the code is automatically safe", "Listing and verification do not eliminate the need for review."],
        ["Private action sharing depends on repository access settings and policy", "Visibility alone does not grant every other repository access."]
      ], "custom"),
    q("a16", "actions", "Version strategy",
      "Maintainers release v1.2.0 with a compatible fix. Which versioning strategy supports convenient upgrades and reproducibility?", [1], [
        ["Overwrite every old release tag with unrelated new code", "Rewriting release tags makes historical consumption unpredictable."],
        ["Keep release tags stable, update the supported major tag, and offer commit SHA pinning", "Consumers can choose a moving compatible major or an immutable revision."],
        ["Remove all previous releases immediately", "This disrupts existing consumers and rollback options."],
        ["Ask callers to always use an unreviewed development branch", "A floating development branch is not a stable release contract."]
      ], "releases"),
    q("a17", "actions", "Immutable references",
      "A repository enforces full-length SHA pinning for actions. Which reference satisfies that requirement?", [2], [
        ["vendor/action@main", "Branches are moving references, not full-length commit SHAs."],
        ["vendor/action@v2", "A major-version tag is not a full-length commit SHA."],
        ["vendor/action@ followed by a trusted full 40-character commit SHA", "A full SHA identifies a specific revision that can be reviewed."],
        ["vendor/action@latest", "Latest is a moving reference, not an immutable revision pin."]
      ], "hardening"),
    q("a18", "actions", "Action documentation",
      "An action adds an input and changes behavior. Which two maintenance tasks most directly help existing callers?", [0, 2], [
        ["Update usage documentation, defaults, and examples", "Callers need an accurate contract for the changed behavior."],
        ["Silently change the meaning of all previous tags", "That breaks trust in existing release references."],
        ["Test supported platforms and assess compatibility before versioning", "Compatibility testing informs whether a major release is needed."],
        ["Delete its metadata description", "Removing contract documentation makes adoption harder."]
      ], "releases"),
    q("a19", "actions", "Outputs versus summaries",
      "A custom action must expose a machine-readable version and a human-readable release report. Which two interfaces fit?", [1, 3], [
        ["Only console.log for both", "Log text is not a dependable declared output interface."],
        ["A declared output populated through GITHUB_OUTPUT or core.setOutput", "Named outputs let later steps consume the version."],
        ["GITHUB_ENV for all downstream jobs automatically", "Job-local environment variables do not propagate to every job."],
        ["GITHUB_STEP_SUMMARY or the toolkit summary API", "This produces a Markdown report for the run summary."]
      ], "commands"),
    q("a20", "actions", "Testing action failures",
      "An action fails only when called from another repository. Which investigation is most useful?", [0], [
        ["Check shipped dependencies, action-relative paths, and caller permissions in logs", "Remote consumption exposes packaging, path, and permission assumptions."],
        ["Require the caller's repository name to match the action's name", "Repository names do not need to match."],
        ["Assume local success proves remote packaging is correct", "Local files or dependencies may be missing from the distributed action."],
        ["Suppress all errors to guarantee a green check", "This hides incorrect behavior instead of fixing remote consumption."]
      ], "custom"),

    q("e01", "enterprise", "Policy hierarchy",
      "Enterprise policy permits only selected actions. A repository administrator wants to allow all actions. What happens?", [1], [
        ["The repository setting always overrides enterprise policy", "Lower-level settings cannot relax enforced enterprise restrictions."],
        ["The repository remains constrained by enterprise policy", "Enterprise governance bounds organization and repository choices."],
        ["Adding a YAML comment overrides the policy", "Comments cannot change authorization settings."],
        ["Only Marketplace actions ignore enterprise policy", "Marketplace actions remain subject to usage policy."]
      ], "policies"),
    q("e02", "enterprise", "Runner isolation",
      "Only selected production repositories should use sensitive self-hosted runners. Which control is designed for this?", [0], [
        ["Runner groups with repository access restrictions", "Groups scope which repositories may use their runners."],
        ["A label named secret without access restrictions", "Labels route jobs; they are not a repository access boundary."],
        ["A public README saying do not use", "Documentation is not an enforceable access policy."],
        ["A workflow status badge", "A badge has no runner authorization function."]
      ], "groups"),
    q("e03", "enterprise", "Runner labels",
      "What does runs-on: [self-hosted, linux, x64, gpu] require?", [2], [
        ["Any runner with one of those labels", "Runner label matching is conjunctive."],
        ["Four runners, one per label", "One job runs on one runner matching its selection."],
        ["An authorized runner matching all the labels", "The runner must satisfy every label and applicable access policy."],
        ["GitHub automatically provisions a GPU for any self-hosted runner", "Labels describe capabilities; they do not install hardware."]
      ], "runners"),
    q("e04", "enterprise", "Operational ownership",
      "Which two responsibilities normally belong to the owner of a self-hosted runner?", [0, 3], [
        ["Patch and secure its operating system and installed software", "You operate the machine and its security posture."],
        ["Assume GitHub always recreates a clean VM after each job", "Self-hosted machines are not automatically fresh per job."],
        ["Delegate all hardware maintenance to GitHub by assigning a label", "Labels do not transfer infrastructure ownership."],
        ["Monitor availability and scale runner capacity", "You must provide adequate healthy execution capacity."]
      ], "runners"),
    q("e05", "enterprise", "Hosted runner lifecycle",
      "For standard GitHub-hosted VM jobs, which assumption distinguishes them from persistent self-hosted runners?", [1], [
        ["Every job shares the previous job's complete filesystem", "Standard hosted VM jobs do not share persistent workspaces."],
        ["Each job normally gets a fresh VM environment", "Hosted VM isolation reduces dependence on earlier jobs' state."],
        ["Repository secrets are permanently installed in the image", "Secrets are provided to authorized execution, not baked into runner images."],
        ["They cannot run setup actions", "Setup actions are commonly used on hosted runners."]
      ], "hosted"),
    q("e06", "enterprise", "Image changes",
      "A workflow on windows-latest breaks after the hosted image changes. Which two practices help diagnose and control this?", [0, 2], [
        ["Inspect runner image release notes and the run's image details", "They identify changes in OS and preinstalled tooling."],
        ["Assume latest is a permanent version contract", "Latest labels can migrate to newer supported images."],
        ["Use an explicit supported image label and setup actions for required tool versions", "Explicit selection reduces surprise, while tool setup avoids image assumptions."],
        ["Store the image label in an artifact and never inspect support dates", "A stored label does not ensure continued image availability."]
      ], "hosted"),
    q("e07", "enterprise", "Required tools",
      "A team requires a specific Node version rather than whichever one happens to be preinstalled. What is appropriate?", [2], [
        ["Run node without checking its version forever", "Preinstalled versions can change with hosted images."],
        ["Put node-version into secrets and assume that installs Node", "Configuration storage alone does not install a runtime."],
        ["Use a setup action specifying the required version", "Setup actions select/install the runtime for the job."],
        ["Rename the runner label to the Node version", "A new label does not install software."]
      ], "hosted"),
    q("e08", "enterprise", "Private networking",
      "A build needs internal network access and a specialized hardware device. Which runner model gives the organization direct control of both?", [0], [
        ["A suitably configured self-hosted runner on that network", "You control its hardware, network, and installed software."],
        ["Any standard hosted runner with no network configuration", "Standard hosted runners do not automatically reach private devices."],
        ["A composite action with a hardware: true input", "An input cannot create physical network access or hardware."],
        ["A repository secret named internal-network", "A secret value is not a network connection."]
      ], "runners"),
    q("e09", "enterprise", "IP allow lists",
      "A hosted build must access a service that permits only known source IPs. What should administrators evaluate?", [1], [
        ["The workflow display name as a stable source IP", "Names have no relationship to outbound IP addressing."],
        ["Larger hosted runner networking/static IP options or controlled self-hosted egress", "Choose supported networking that matches the service's allow-list requirements."],
        ["Assume every standard hosted runner always has the same single IP", "Standard hosted runner address ranges are not a single fixed egress address."],
        ["Use a different artifact name on each run", "Artifact naming cannot change network authorization."]
      ], "hosted"),
    q("e10", "enterprise", "Ephemeral runners",
      "An autoscaling design must reduce persistence of untrusted job state. Why use ephemeral self-hosted runners with external log collection?", [3], [
        ["Ephemeral runners never need security updates", "Their underlying images and infrastructure still need maintenance."],
        ["They grant every repository access by default", "Access remains governed by runner group and repository policy."],
        ["They guarantee all tests succeed", "Runner lifecycle does not determine test correctness."],
        ["They handle a single job before deregistration, while logs remain available externally", "One-job execution reduces reuse; forwarding logs preserves diagnostics."]
      ], "runners"),
    q("e11", "enterprise", "Organization secrets",
      "An API credential is shared by five approved repositories but must not reach all other repositories. What is the best configuration?", [0], [
        ["An organization secret restricted to selected repositories", "Organization secret access policies can restrict eligible repositories."],
        ["A plaintext organization variable visible to all", "A credential belongs in encrypted secrets with limited access."],
        ["A secret printed in the organization's README", "Publishing the value destroys its confidentiality."],
        ["An artifact downloaded automatically by all repositories", "Artifacts are not scoped secret storage."]
      ], "secrets"),
    q("e12", "enterprise", "Environment secrets",
      "A deploy job needs a credential scoped to production. Which two conditions matter?", [1, 3], [
        ["Every job receives every environment secret by default", "Environment access is tied to the job's selected environment."],
        ["The job references the production environment", "This associates execution with that environment's secrets and rules."],
        ["A step is merely named production", "A step name does not select a deployment environment."],
        ["Required environment protections are satisfied before secret access", "Approval gates can hold a job before protected secrets become available."]
      ], "environments"),
    q("e13", "enterprise", "Secret precedence",
      "The same secret name is configured at organization, repository, and production environment scope. A permitted production job reads it. Which value wins?", [2], [
        ["Organization", "The organization value is overridden by a more specific applicable scope."],
        ["Repository", "An applicable environment secret takes precedence over repository scope."],
        ["Production environment", "The most specific applicable secret scope takes precedence."],
        ["The three strings are concatenated", "Secrets with the same name are resolved by precedence, not concatenation."]
      ], "secrets"),
    q("e14", "enterprise", "Secrets versus variables",
      "Where should administrators store a non-sensitive deployment region and a private API credential, respectively?", [0], [
        ["A configuration variable and an encrypted secret", "Variables fit non-sensitive configuration; secrets protect credentials."],
        ["Both as public workflow log messages", "The private credential must not be exposed in logs."],
        ["Both as artifact filenames", "Artifact names are neither configuration scope nor encrypted secret storage."],
        ["A secret for the region and a plaintext variable for the credential", "The private credential must not be stored as an unencrypted variable."]
      ], "variables"),
    q("e15", "enterprise", "Variable contexts",
      "A repository configuration variable is named DEPLOY_REGION. Which expression accesses it?", [1], [
        ["secrets.DEPLOY_REGION", "Secrets and configuration variables are separate stores."],
        ["vars.DEPLOY_REGION", "The vars context accesses configuration variables."],
        ["steps.DEPLOY_REGION", "Steps holds step metadata and outputs."],
        ["matrix.DEPLOY_REGION without a matrix definition", "A repository variable does not automatically become a matrix axis."]
      ], "variables"),
    q("e16", "enterprise", "Secrets REST API",
      "An administrator automates updating a repository Actions secret through the REST API. What must the client do before sending the value?", [3], [
        ["Base64-encode plaintext only and consider it encrypted", "Encoding alone does not satisfy the API's public-key encryption contract."],
        ["Write the value to a public issue for the API to read", "This exposes the credential."],
        ["Use the artifact upload endpoint", "Artifact APIs do not configure repository secrets."],
        ["Fetch the public key and encrypt the value using the documented sealed-box method", "The secret update API requires an encrypted value and key identifier."]
      ], "api"),
    q("e17", "enterprise", "Secret readback",
      "A compliance tool lists repository secrets through the REST API. Can it retrieve their plaintext values?", [0], [
        ["No; it can read metadata, not existing plaintext values", "Secrets are not returned as recoverable plaintext through these endpoints."],
        ["Yes, if it requests an extra log field", "Log fields do not decrypt stored secrets."],
        ["Yes, listing artifacts automatically reveals every secret", "Artifacts are a separate API resource."],
        ["Only if the secret name is lowercase", "Name casing does not change the secret readback restriction."]
      ], "api"),
    q("e18", "enterprise", "Sharing private automation",
      "Another approved repository cannot use a private organization's action despite a valid uses path. Which two settings should you examine?", [0, 2], [
        ["The source repository's Actions access settings", "Private sharing must permit the intended callers."],
        ["The consumer's README heading size", "Markdown formatting cannot grant action access."],
        ["Organization/enterprise action usage policies", "A correct reference can still be blocked by governance."],
        ["Whether the action's logo is published", "Branding is not a sharing authorization mechanism."]
      ], "policies"),
    q("e19", "enterprise", "Organization templates",
      "Where does an organization maintain workflow template YAML files and their properties metadata for discovery?", [1], [
        ["The Issues tab of every consumer repository", "Issues are not the workflow template distribution location."],
        ["The workflow-templates directory in the organization's .github repository", "Templates and their properties files are distributed from that convention."],
        ["Every runner's GITHUB_OUTPUT file", "Output files are ephemeral runtime data, not shared templates."],
        ["A matrix include entry in an unrelated workflow", "Matrix includes do not publish starter workflows."]
      ], "templates"),
    q("e20", "enterprise", "Central standards",
      "One hundred repositories need standardized CI with centrally maintained fixes, but controlled rollout of revisions. Which approach fits best?", [2], [
        ["Copy YAML once and never update the copies", "Independent copies drift and do not consume centralized fixes."],
        ["A single organization variable containing all shell code", "Variables are not a versioned multi-job automation contract."],
        ["A reusable workflow with callers updated to reviewed version references", "Central implementation and pinned adoption enable controlled rollout."],
        ["Grant every workflow unrestricted organization-admin credentials", "Excessive credentials are not required for centralized reuse."]
      ], "reuse"),
    q("e21", "enterprise", "Retention administration",
      "An organization wants lower artifact storage cost while preserving compliance evidence. Which approach is appropriate?", [0], [
        ["Set appropriate retention limits and automate policy-based cleanup with Actions APIs", "Retention and targeted cleanup should respect evidence requirements."],
        ["Delete all logs and artifacts immediately regardless of policy", "Indiscriminate deletion can violate compliance and destroy diagnostics."],
        ["Store credentials in artifacts indefinitely", "Artifacts are not a credential store and indefinite retention raises risk."],
        ["Increase every matrix dimension to reduce storage", "More jobs can produce more outputs rather than reducing storage."]
      ], "api"),
    q("e22", "enterprise", "Nested permissions",
      "A reusable workflow calls another reusable workflow. The caller grants contents: read only. Can a callee elevate to contents: write?", [1], [
        ["Yes, nested workflows always gain administrator access", "Reuse does not bypass the caller's permission boundary."],
        ["No; permissions can be maintained or reduced, not elevated through the chain", "Nested reusable workflows remain within the caller's token permissions."],
        ["Yes, if the callee includes an output named write", "Output names do not grant API authorization."],
        ["Only by changing the job's display name", "Display names do not affect token scope."]
      ], "reuse"),
    q("e23", "enterprise", "Non-public templates",
      "An internal starter workflow is not visible to an intended team. What is the most relevant investigation?", [3], [
        ["Whether the cron expression has five fields", "A schedule does not determine template visibility."],
        ["Whether the team uses a different operating system", "Template discovery is not runner OS selection."],
        ["Whether every action has a Marketplace badge", "Marketplace branding does not expose an internal template."],
        ["The organization's .github repository visibility, team access, and applicable template availability", "Non-public template discovery depends on access and supported visibility settings."]
      ], "templates"),

    q("s01", "security", "Least privilege",
      "A job only checks out source and runs tests. What is an appropriate default GITHUB_TOKEN permission?", [0], [
        ["contents: read with other unneeded scopes left unset", "Grant only what the job needs to read repository contents."],
        ["write-all", "Broad write scope is unnecessary for checkout and tests."],
        ["Organization administrator through a PAT", "Repository tests do not require organization administration."],
        ["packages: write and issues: write by default", "Unneeded write permissions increase exposure."]
      ], "token"),
    q("s02", "security", "Token lifecycle",
      "Which two properties distinguish GITHUB_TOKEN from a typical long-lived personal access token?", [1, 3], [
        ["It automatically grants write access to every repository in the organization", "It is scoped to the workflow's repository and granted permissions."],
        ["It is automatically issued for workflow job execution and expires", "It is an ephemeral job token rather than a durable personal credential."],
        ["It should be printed so later workflows can reuse it forever", "It must remain secret and is not a permanent reusable credential."],
        ["Its capabilities are controlled by scopes, policy, and trigger restrictions", "Explicit permissions cannot override event or governance restrictions."]
      ], "token"),
    q("s03", "security", "OIDC federation",
      "A cloud deployment must avoid stored long-lived cloud credentials. Which two configuration elements enable secure OIDC authentication?", [0, 2], [
        ["Grant id-token: write to the authenticating job", "This lets the job request an OIDC identity token."],
        ["Store an administrator cloud password in every repository variable", "This stores a long-lived credential in an inappropriate plaintext store."],
        ["Configure cloud trust for the intended repository/ref or environment claims", "Cloud federation must constrain which workflow identities are accepted."],
        ["Assume id-token: write automatically grants every cloud role", "The cloud provider's trust and role policy still determine authorization."]
      ], "oidc"),
    q("s04", "security", "Script injection",
      "A PR title is attacker-controlled. Which pattern avoids substituting it directly into Bash source?", [2], [
        ['run: echo "${{ github.event.pull_request.title }}"', "Expression substitution happens before shell parsing and can inject syntax."],
        ["run: eval '${{ github.event.pull_request.title }}'", "Eval executes attacker-controlled data as shell code."],
        ['Map the title to PR_TITLE in env, then run printf \'%s\\n\' "$PR_TITLE"', "A quoted environment value is treated as data rather than inserted shell source."],
        ["Trust the title because it appears in the GitHub UI", "UI visibility does not make contributor-controlled strings trustworthy."]
      ], "hardening"),
    q("s05", "security", "Privileged PR events",
      "A pull_request_target workflow checks out a fork's head commit and runs its install scripts with secrets. What is the core risk?", [0], [
        ["Untrusted contributor code executes in a privileged context", "The base-context event can expose credentials and write privileges to hostile code."],
        ["It can never access secrets, so there is no risk", "Unlike ordinary fork pull_request runs, this event can have privileged access."],
        ["It only changes the workflow badge color", "The issue is executable untrusted code, not display metadata."],
        ["Its only risk is slow dependency downloads", "Performance is secondary to credential and repository compromise."]
      ], "hardening"),
    q("s06", "security", "Supply-chain review",
      "Which two steps most directly reduce risk when adopting a third-party action?", [1, 3], [
        ["Trust its download count as proof of safety", "Popularity does not establish code integrity or least privilege."],
        ["Review its source, maintenance, and requested capabilities", "Evaluate what will execute and what access it requires."],
        ["Always use @main so all changes arrive immediately", "A floating development reference introduces unreviewed changes."],
        ["Pin a reviewed full commit SHA and manage updates deliberately", "Pinning fixes the revision while reviewed updates retain maintainability."]
      ], "hardening"),
    q("s07", "security", "Production approvals",
      "A trusted build may deploy only after an authorized human approves production. Which control enforces this at the deployment boundary?", [2], [
        ["A shell comment saying wait for approval", "A comment does not enforce a gate."],
        ["A repository topic named approved", "Topics are not deployment authorization controls."],
        ["A production environment with required reviewers and suitable branch restrictions", "Environment protections gate the job and its protected secrets."],
        ["A workflow_dispatch string defaulting to yes", "An input value is not an authorized independent review."]
      ], "environments"),
    q("s08", "security", "Artifact provenance",
      "What does generating and verifying an artifact attestation help establish?", [0], [
        ["The artifact's provenance and association with an expected build identity", "Attestations support verification of where and how an output was built."],
        ["That every functional requirement has passed automatically", "Provenance is not proof of functional correctness."],
        ["That the artifact contains no vulnerabilities by definition", "Attestations do not replace vulnerability analysis."],
        ["That deployment no longer needs authorization checks", "Identity verification does not eliminate deployment policy."]
      ], "attestations"),
    q("s09", "security", "Dependency caching",
      "Which cache key design best avoids reusing incompatible dependency state across OS and lockfile changes?", [1], [
        ["A single constant key named dependencies", "A constant key does not distinguish platforms or dependency revisions."],
        ["Include runner.os and a hash of the dependency lockfile", "These dimensions separate platforms and invalidate changed dependency sets."],
        ["Use the deployment password as the cache key", "Secrets must not be used as visible cache identifiers."],
        ["Use only the workflow display name", "Display names do not encode dependency compatibility."]
      ], "cache"),
    q("s10", "security", "Performance and cost",
      "Which two changes reduce waste without deliberately dropping required test coverage?", [0, 3], [
        ["Cancel obsolete branch CI runs using scoped concurrency", "Newer commits can supersede older runs without affecting unrelated branches."],
        ["Mark every failed test as successful", "Hiding failures destroys the reliability of the test signal."],
        ["Remove every supported-platform matrix variant", "This eliminates required coverage rather than making it efficient."],
        ["Cache dependencies and reuse built artifacts between jobs", "This avoids repeated downloads and rebuilding identical outputs."]
      ], "cache"),
    q("s11", "security", "Secret exposure",
      "A script transforms a secret before logging it. Does GitHub's automatic masking make logging it safe?", [2], [
        ["Yes, masking guarantees detection of every transformed value", "Masking is not guaranteed for derived, encoded, or structured representations."],
        ["Yes, secret masking removes the need for access controls", "Masking does not replace least privilege or safe code."],
        ["No; avoid logging secrets and register additional masks where necessary", "Prevent exposure rather than relying on redaction of all possible forms."],
        ["Only artifacts are masked, so print secrets into log messages", "Artifacts are not automatically sanitized secret storage."]
      ], "hardening"),
    q("s12", "security", "Untrusted runner workloads",
      "A public repository wants fork PR tests on a persistent self-hosted runner with production network access. What is the safest recommendation?", [0], [
        ["Separate untrusted CI from sensitive infrastructure using isolated, restricted execution", "Untrusted code must not share credentials, persistent state, or privileged network access."],
        ["Expose production credentials to speed up test setup", "This directly increases the compromise risk."],
        ["Use a label named trusted on the same machine and assume it is safe", "Labels do not sandbox malicious code or enforce a trust boundary."],
        ["Rely only on automatic secret masking", "Masking cannot stop code from accessing the network or exfiltrating credentials."]
      ], "hardening")
  ];

  const bank = { exam: "GH-200", reviewed: "2026-11-13", domains, questions };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = bank;
  } else {
    root.GH200Quiz = bank;
  }
})(globalThis);
