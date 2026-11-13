# Domain 3: Azure management and governance (30–35%)

Often the gap for people strong in PaaS/IaaS build work. Treat this domain as equal priority to networking.

---

## 3.1 Cost management

### Factors that affect cost

- Resource type and SKU/size  
- Region (prices differ)  
- Usage meters (compute hours, storage GB, egress, transactions)  
- Bandwidth (outbound data typically costs more than inbound)  
- Reserved vs pay-as-you-go vs spot  
- Licensing (Azure Hybrid Benefit for Windows/SQL with existing licenses)  

### Tools

| Tool | Purpose |
|------|---------|
| **Pricing calculator** | Estimate *future* Azure spend before/while designing |
| **TCO calculator** | Compare on-premises/total cost of ownership *vs* Azure (migration business case) |
| **Microsoft Cost Management + Billing** | Analyze actual spend, budgets, alerts, cost allocation |
| **Tags** | Metadata (CostCenter, Env, Owner) for reporting and chargeback — don’t enforce rules by themselves |
| **Azure Reservations / Savings Plans** | Lower compute cost with commitment |
| **Azure Hybrid Benefit** | Bring Windows Server / SQL licenses to reduce Azure cost |

**Exam traps**

- Pricing calculator ≠ TCO calculator  
- Tags help organize costs; **Azure Policy** can *require* tags  

---

## 3.2 Governance and compliance

### Azure Policy

- Enforce rules: allowed VM SKUs, required tags, allowed locations, audit encryption, etc.
- **Initiatives** = groups of policies.
- States: Audit vs Deny vs DeployIfNotExists, etc. (names at awareness level).

**vs RBAC:** Policy = *what configuration is allowed*; RBAC = *who can do actions*.

### Resource locks

| Lock | Effect |
|------|--------|
| **CanNotDelete** (Delete) | Can read/modify; cannot delete |
| **ReadOnly** | Can read only; no delete/modify |

Locks sit above RBAC — even Owners must remove the lock first to delete.

### Microsoft Purview

- Data governance / discovery / catalog / classification across estate (know **purpose**: govern and understand data, compliance-oriented data map).
- On current AZ-900 outline: “purpose of Microsoft Purview in Azure.”

(Older materials mentioned Blueprints / Service Trust Portal more; current outline emphasizes **Purview**, **Policy**, **locks**. Skim Blueprints as “deprecated/legacy packaging of templates+policy” only if older practice tests mention them.)

---

## 3.3 Managing and deploying resources

| Tool | Purpose |
|------|---------|
| **Azure portal** | Web UI for managing almost everything |
| **Azure Cloud Shell** | Browser-based shell (Bash or PowerShell) with authenticated Azure context |
| **Azure CLI** | Cross-platform command line (`az ...`) |
| **Azure PowerShell** | PowerShell modules (`Az` commands) |
| **Azure Arc** | Project Azure management/governance to **on-premises / multi-cloud / edge** resources |
| **Infrastructure as Code (IaC)** | Declare infra in files; repeatable, versioned deployments |
| **Azure Resource Manager (ARM)** | Control plane for creating/updating/deleting resources; auth, tagging, locks apply here |
| **ARM templates** | JSON IaC native to ARM |
| **Bicep** | DSL that compiles to ARM (often in modern Learn content) |
| **Terraform** | Popular third-party IaC (awareness) |

**Exam cues**

- Manage servers in AWS/on-prem with Azure Policy/Monitor → **Azure Arc**  
- Deploy dozens of resources consistently → **IaC / ARM templates**  
- Quick interactive commands in browser → **Cloud Shell**  

---

## 3.4 Monitoring tools

| Tool | Purpose |
|------|---------|
| **Azure Advisor** | Personalized best-practice recommendations: cost, security, reliability, operational excellence, performance |
| **Azure Service Health** | Personalized view of **Azure platform** incidents, planned maintenance, health advisories affecting *your* services |
| **Azure Status** (status.azure.com) | Global public status (not personalized) |
| **Azure Monitor** | Platform metrics, logs, alerts — the monitoring backbone |
| **Log Analytics** | Query logs with KQL in a workspace |
| **Azure Monitor alerts** | Notify or act when metrics/logs cross thresholds |
| **Application Insights** | APM for apps (requests, failures, dependencies) — part of Monitor family |

**Exam traps**

- Service Health = *your* impacted Azure services; Status page = global  
- Advisor ≠ Monitor (Advisor recommends; Monitor observes/alerts)  
- Defender for Cloud ≠ Advisor (security posture/threats vs broad recommendations)  

---

## Checkpoint questions

1. Pricing calculator vs TCO — which builds a case for leaving a datacenter?
2. Can a Contributor delete a resource with a CanNotDelete lock without removing the lock?
3. Policy vs RBAC — which blocks deploying VMs outside East US?
4. Arc vs ExpressRoute — which extends Azure *management* to non-Azure machines?
5. Service Health vs Azure Monitor — which tells you Microsoft has an outage affecting your VMs’ region?
