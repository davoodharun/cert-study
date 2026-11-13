# AZ-900: Microsoft Azure Fundamentals — Study Guide

Personal study guide aligned to the [official AZ-900 skills measured](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) (as of **July 20, 2026**).

## How to use this guide

You already know **PaaS** well and have a decent grip on **IaaS** and **networking**. Weight your time like this:

| Priority | Area | Why |
|----------|------|-----|
| High | IaaS depth (VMs, scale sets, AVD, compute comparison) | Exam likes scenario “which compute?” questions |
| High | Networking (VNet, peering, VPN, ExpressRoute, endpoints) | Easy marks if you tighten vocabulary |
| High | Identity, security, Zero Trust, Defender for Cloud | Often understudied vs compute/net |
| High | Storage, cost, governance, monitoring | Large % of the exam; less overlap with day-to-day PaaS work |
| Medium | Cloud concepts, shared responsibility, SaaS vs IaaS/PaaS | Quick review; know the *exam wording* |
| Light | PaaS product details | You know this — skim for exam naming |

**Passing score:** 700 / 1000 (scaled)  
**Format:** mostly multiple choice / multi-select / scenario (no deep hands-on config)  
**Official practice:** [free Practice Assessment](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)

### Files in this folder

| File | Contents |
|------|----------|
| [01-cloud-concepts.md](./01-cloud-concepts.md) | Cloud models, shared responsibility, benefits, IaaS/PaaS/SaaS |
| [02-architecture-compute-network.md](./02-architecture-compute-network.md) | Regions, hierarchy, **IaaS + networking** (heavy) |
| [03-storage.md](./03-storage.md) | Storage types, tiers, redundancy, migrate/copy tools |
| [04-identity-security.md](./04-identity-security.md) | Entra ID, auth, RBAC, Zero Trust, Defender |
| [05-management-governance.md](./05-management-governance.md) | Cost, Policy, locks, portal/CLI, ARM, monitoring |
| [06-quick-reference.md](./06-quick-reference.md) | Cheat sheets, “pick the right service,” trap questions |
| [07-study-plan.md](./07-study-plan.md) | Suggested 1–2 week plan for your background |

### Official Microsoft Learn paths

1. [Describe cloud concepts](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/)
2. [Describe Azure architecture and services](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/)
3. [Describe Azure management and governance](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/)

### Exam domain weights

| Domain | Weight |
|--------|--------|
| Describe cloud concepts | 25–30% |
| Describe Azure architecture and services | 35–40% |
| Describe Azure management and governance | 30–35% |

---

*Source of truth for topics: Microsoft Learn AZ-900 study guide. Review that page again if you sit the exam after a major update date.*
