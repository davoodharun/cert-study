# Suggested study plan (your background)

Assumptions: strong **PaaS**, decent **IaaS + networking**. Goal: pass AZ-900 efficiently without relearning App Service depth.

Target: **~7–10 focused hours** if you already work in Azure; stretch to **2 weeks** if part-time.

---

## Day 1 — Cloud concepts + gaps (≈ 1–1.5 hr)

- Read [01-cloud-concepts.md](./01-cloud-concepts.md)
- Skim IaaS/PaaS/SaaS use cases; drill **shared responsibility** and **CapEx/OpEx**
- Light PaaS only: confirm you can *name* App Service / Functions / SaaS examples

**Do:** official Learn “Describe cloud concepts” modules if any term feels mushy  
**Skip:** deep PaaS tutorials you already know

---

## Day 2 — IaaS compute (≈ 1.5–2 hr) — priority

- Read compute sections in [02-architecture-compute-network.md](./02-architecture-compute-network.md)
- Drill: VM required resources, **VMSS**, **availability sets vs zones**, **AVD**
- Compare VM vs containers vs Functions until choosing is automatic

**Do:** in portal (free account): create a VM in a zone; glance at scale set blade  
**Optional Microsoft Learn:** describe compute services module

---

## Day 3 — Networking (≈ 1.5–2 hr) — priority

- Finish networking in [02-architecture-compute-network.md](./02-architecture-compute-network.md)
- Drill: VNet, subnet, peering (non-transitive), **VPN vs ExpressRoute**, public vs private endpoints, Bastion, NSG
- Hierarchy: regions, pairs, AZs, management groups → subscriptions → RGs

**Do:** sketch a hub-spoke on paper (hub VNet + two spokes + VPN to on-prem)

---

## Day 4 — Storage (≈ 1–1.5 hr)

- Read [03-storage.md](./03-storage.md)
- Memorize: Blob / Files / Queues / Tables; Hot–Archive; **LRS/ZRS/GRS/GZRS/RA-***
- Tools: AzCopy, Storage Explorer, File Sync, Migrate, Data Box

**Do:** flash the redundancy table until instant recall

---

## Day 5 — Identity & security (≈ 1.5–2 hr) — priority if new to Entra

- Read [04-identity-security.md](./04-identity-security.md)
- Drill: Entra ID vs Domain Services, SSO/MFA/passwordless, Conditional Access, RBAC scopes, Zero Trust, defense in depth, Defender for Cloud

**Do:** in Entra admin / Azure portal: find Conditional Access and a role assignment (even if you don’t change anything)

---

## Day 6 — Management & governance (≈ 1.5–2 hr) — priority

- Read [05-management-governance.md](./05-management-governance.md)
- Drill: Pricing vs TCO vs Cost Management; tags; Policy vs locks vs RBAC; portal/CLI/Cloud Shell; Arc; ARM/IaC; Advisor / Service Health / Monitor / App Insights / Log Analytics

**Do:** open Pricing calculator and Service Health once so names stick

---

## Day 7 — Practice + cram (≈ 2 hr)

1. Walk [06-quick-reference.md](./06-quick-reference.md) cold — cover answers, quiz yourself  
2. Take Microsoft’s **free Practice Assessment** for Azure Fundamentals  
3. Missed a topic? Only re-read that section — don’t restart App Service deep-dives  
4. Optional: John Savill AZ-900 Study Cram (YouTube) at 1.25–1.5× for a full pass  

Aim: practice score consistently **≥ ~80%** before scheduling.

---

## What to under-study (on purpose)

- Deep App Service / Functions / managed DB configuration  
- Hands-on Kubernetes networking  
- Exact PowerShell/CLI syntax beyond recognizing tools  
- Pricing numbers (know *factors* and *tools*, not dollar rates)

---

## What must be automatic

1. Shared responsibility per IaaS/PaaS/SaaS  
2. Hierarchy + AZ vs region pair  
3. VPN vs ExpressRoute; peering; private endpoint  
4. Storage tiers + LRS/ZRS/GRS/GZRS  
5. RBAC vs Policy vs locks  
6. Advisor vs Monitor vs Service Health vs Defender for Cloud  
7. Pricing calculator vs TCO vs Cost Management  

---

## Exam day

- Read every question; multi-select needs **all** correct options  
- Prefer the answer matching Microsoft vocabulary (shared responsibility, Zero Trust, etc.)  
- When stuck between two: pick the service whose *primary purpose* matches the scenario (not a side feature)

---

## Sources

- [Official AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)  
- [Azure Fundamentals certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/) (practice assessment + Learn paths)  
