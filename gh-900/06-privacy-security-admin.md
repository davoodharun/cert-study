# Domain 6: Privacy, security, and administration (10–15%)

Often undersampled by people who “just push code.” Drill roles, visibility, branch protection, and account security.

---

## Account security

| Control | Purpose |
|---------|---------|
| **2FA (two-factor authentication)** | Password + second factor (app, security key, etc.) |
| **Passkeys** | Phishing-resistant passwordless-style sign-in using device authenticators |

Organizations/enterprises often **require** 2FA for members.

**Exam:** Securing the human account is step zero — before repo permissions matter.

---

## Access permissions and roles

### Repository roles (classic model — know the ladder)

| Role | Typical power |
|------|----------------|
| **Read** | Clone, pull, view (no write) |
| **Triage** | Manage issues/PRs without push to code |
| **Write** | Push to non-protected branches, manage issues/PRs |
| **Maintain** | Manage repo without full admin-destructive powers |
| **Admin** | Full repo settings, collaborators, delete, etc. |

Exact capabilities can vary by product updates; exam wants the *ordering* and that triage ≠ write to code.

### Organization roles / teams

- **Owners** — full org control  
- **Members** — standard membership  
- **Billing managers** (where applicable)  
- **Teams** — groups with repo access; nested teams possible  
- Team sync / IdP — enterprise identity patterns  

Permissions are usually granted via **teams**, not one-off forever chaos.

---

## Enterprise Managed Users (EMUs)

- Enterprise accounts provision users from the company IdP (e.g. Entra ID / Okta)  
- Users are *enterprise-managed* identities (often `_*` enterprise shortcode style), not free personal signup sprawl  
- Centralizes authentication, lifecycle, and access for regulated enterprises  

**Exam:** EMUs = enterprise-controlled user identities for GitHub, not a repo feature.

---

## Copilot policy (org-wide)

Admins manage whether Copilot is allowed, for whom, and related enterprise/business policies (ties to Domain 4 tiers).

---

## Repository privacy and visibility

| Visibility | Who can see |
|------------|-------------|
| **Public** | Anyone on the internet |
| **Private** | Only people/teams you grant |
| **Internal** | Enterprise members (Enterprise feature) — not the whole internet |

Changing visibility has security/compliance impact; public ≠ OSS license (LICENSE file still needed for legal clarity).

---

## Branch protection rules

Protect important branches (usually `main`):

Examples of rules:

- Require pull request before merge  
- Require approvals / CODEOWNERS review  
- Require status checks (CI) to pass  
- Restrict who can push  
- Prevent force-push / deletion  
- Require linear history / signed commits (where configured)  

**Rulesets** may appear in newer UI as the evolution of classic branch protection — know the *purpose*: enforce quality/security gates on protected branches.

**Exam cue:** “Nobody pushes straight to main; PR + review + CI required” → branch protection / rulesets.

---

## Organization settings, teams, and roles

Know admins can configure:

- Member privileges defaults  
- Base repository permissions  
- Security features at org level (e.g. Dependabot, secret scanning — awareness)  
- Outside collaborators policies  
- Team structure and code review assignment  

Related security features (recognize names):

| Feature | Purpose |
|---------|---------|
| **Dependabot alerts / updates** | Vulnerable dependency notifications / PRs |
| **Secret scanning** | Detect accidentally committed secrets |
| **Code scanning** | Find code vulnerabilities (often CodeQL) |
| **Security policy (SECURITY.md)** | How to report issues privately |

Deep config is out of scope; purpose-matching questions are in scope.

---

## Checkpoint questions

1. 2FA vs passkeys — both secure accounts; what’s the point of requiring 2FA org-wide?  
2. Triage vs Write — who can push commits?  
3. Public vs Internal visibility — which is enterprise-only?  
4. What do branch protection rules typically prevent on `main`?  
5. What are EMUs for?  
