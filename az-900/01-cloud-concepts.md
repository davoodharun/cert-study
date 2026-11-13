# Domain 1: Describe cloud concepts (25–30%)

## 1.1 Cloud computing

**Cloud computing** — delivering compute, storage, networking, and services over the internet on-demand, usually with pay-as-you-go billing and elasticity.

### Shared responsibility model

Know *who* is responsible for *what* under each service type:

| Layer | On-premises | IaaS | PaaS | SaaS |
|-------|-------------|------|------|------|
| Data & access | You | You | You | You |
| Applications | You | You | You | Provider |
| Runtime / OS | You | You | Provider | Provider |
| Networking / virtualization | You | Shared* | Provider | Provider |
| Physical hosts / datacenter | You | Provider | Provider | Provider |

\*With IaaS you still configure VNets, NSGs, OS hardening, etc. The cloud provider owns the physical fabric.

**Exam tip:** “Who patches the guest OS?” → **You (customer)** on IaaS; **provider** on PaaS/SaaS for the platform.

### Cloud models

| Model | Definition | Typical use |
|-------|------------|-------------|
| **Public** | Shared cloud resources owned by a provider (Azure) | Most Azure workloads |
| **Private** | Cloud used by a single org (on-prem or hosted) | Strict control / compliance |
| **Hybrid** | Mix of public + private (or on-prem) connected together | Gradual migration, identity, backup to cloud |

Also know **multi-cloud** (more than one public cloud) as a related idea, even if not always listed as a formal exam bullet.

### Consumption-based & pricing models

- **Consumption-based / pay-as-you-go:** pay for what you use; scale up/down.
- **Reserved instances / savings plans:** commit for lower price (predictable workloads).
- **Spot / low-priority:** cheap interruptible capacity (batch, tolerant jobs).
- CapEx (upfront hardware) vs OpEx (ongoing cloud bills) — cloud shifts many costs to OpEx.

### Serverless

You deploy code or event-driven logic; the platform scales and you don’t manage servers.

- Azure examples: **Azure Functions**, **Logic Apps** (orchestration), some container options billed by use.
- Exam contrast: serverless ≠ “no servers exist”; it means **you don’t manage them**.

---

## 1.2 Benefits of cloud services

Memorize these words; exam language is almost verbatim:

| Benefit | Meaning |
|---------|---------|
| **High availability** | Stay up via redundancy (AZs, load balancers, multi-region) |
| **Scalability** | Grow capacity: **scale out** (more instances) vs **scale up** (bigger VM) |
| **Elasticity** | Auto scale with demand, then shrink |
| **Agility** | Deploy/change faster |
| **Reliability / predictability** | Geo-redundancy, SLAs, consistent environments |
| **Security & governance** | Central policies, identity, encryption, compliance tools |
| **Manageability** | Portal, automation, monitoring, IaC |

**Disaster recovery** and **geo-distribution** often appear next to reliability/availability.

---

## 1.3 Cloud service types (IaaS / PaaS / SaaS)

### Quick map (keep PaaS light)

| Type | You manage | Provider manages | Azure examples |
|------|------------|------------------|----------------|
| **IaaS** | OS, middleware, apps, data, much of network config | Physical, hypervisor, host infra | VMs, VNets, disks, load balancers |
| **PaaS** | Apps + data (+ config) | OS, runtime, platform | App Service, Azure SQL (PaaS), Functions*, AKS (shared) |
| **SaaS** | Data + access/settings | App + everything under | Microsoft 365, Dynamics 365, many marketplace SaaS |

\*Functions is often discussed as serverless/PaaS.

### Use-case cues for the exam

- Need full control of OS / custom middleware → **IaaS**
- Want to deploy app code without managing VMs → **PaaS**
- Just use ready software over the web → **SaaS**
- Lift-and-shift VMs → usually **IaaS**
- Rewrite as web app / managed DB → **PaaS**

### Shared responsibility reminder (exam favorite)

Customer is **always** responsible for:

- Data classification and protection choices
- Identities and access (who can log in)
- Endpoint devices (often)
- On-prem parts of hybrid

Provider is **always** responsible for:

- Physical security of datacenters
- Underlying host infrastructure (to the level of the service model)

---

## Checkpoint questions

1. CapEx vs OpEx — which does pay-as-you-go lean toward?
2. You install and patch Windows Server on an Azure VM. Shared responsibility: whose job is the OS patch?
3. Hybrid vs private: company keeps Active Directory on-prem and apps in Azure — which model?
4. Name one serverless Azure service.
