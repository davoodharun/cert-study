# AZ-900 quick reference & trap questions

## Pick the right service (drill this)

| Scenario | Likely answer |
|----------|---------------|
| Full control of OS / custom installers | **Virtual Machine (IaaS)** |
| Host web app, don’t manage OS | **App Service** |
| Event-driven code, auto scale to zero | **Azure Functions** |
| Orchestrate many containers | **AKS** |
| Simple container without orchestrator | **ACI** |
| Remote Windows desktops as a service | **Azure Virtual Desktop** |
| Private IPs in cloud network | **VNet + subnets** |
| Connect two Azure VNets | **VNet peering** |
| Hybrid over internet (encrypted) | **VPN Gateway** |
| Hybrid private dedicated circuit | **ExpressRoute** |
| RDP/SSH without public IP on VM | **Azure Bastion** |
| Filter traffic on subnet/NIC | **NSG** |
| Private IP for PaaS into your VNet | **Private endpoint** |
| Object / unstructured data | **Blob** |
| SMB file share | **Azure Files** |
| Survive zone failure (storage) | **ZRS / GZRS** |
| Survive region failure (storage) | **GRS / GZRS** |
| Bulk CLI copy to storage | **AzCopy** |
| Ship disks/appliance for huge ingest | **Data Box** |
| Assess/migrate servers to Azure | **Azure Migrate** |
| Cloud identity SSO/MFA | **Microsoft Entra ID** |
| Managed classic AD (Kerberos) in Azure | **Entra Domain Services** |
| Require MFA when risky/sign-in from abroad | **Conditional Access** |
| Who can create resources | **RBAC** |
| Allowed locations / required tags | **Azure Policy** |
| Prevent accidental delete | **Resource lock** |
| Estimate future bill | **Pricing calculator** |
| Compare datacenter vs Azure cost | **TCO calculator** |
| Track actual spend / budgets | **Cost Management** |
| Best-practice recommendations | **Azure Advisor** |
| Platform incident affecting you | **Service Health** |
| Metrics, logs, alerts, App Insights | **Azure Monitor** |
| Security posture / threats | **Defender for Cloud** |
| Manage on-prem server with Azure tools | **Azure Arc** |
| Declarative deploy at scale | **ARM templates / IaC** |
| Data catalog / governance | **Microsoft Purview** |

---

## Shared responsibility — one-liners

- **IaaS:** you patch the guest OS.  
- **PaaS:** provider patches the platform OS/runtime; you secure the app/data.  
- **SaaS:** provider runs the app; you still secure accounts/data classification.  
- **Always you:** identities, data, access decisions.

---

## Hierarchy & HA one-liners

- Billing boundary → **subscription**  
- Policy across many subscriptions → **management group**  
- Delete group → resources go → **resource group**  
- Datacenter failure in region → **Availability Zones**  
- Entire region failure → **multi-region / GRS / region pair strategies**  
- Scale instances automatically → **VM Scale Sets** (or PaaS scale / Functions)

---

## Common traps

1. **Peering is not transitive** — use hub-spoke + NVA/firewall or careful design.  
2. **ExpressRoute is not “VPN over internet”** — it’s private connectivity.  
3. **Tags don’t enforce** — Policy does.  
4. **Locks beat Owners** until removed.  
5. **Pricing calculator ≠ TCO ≠ Cost Management**.  
6. **Advisor ≠ Monitor ≠ Service Health ≠ Defender for Cloud**.  
7. **Availability set ≠ Availability zone**.  
8. **Public endpoint + NSG** is not the same as **private endpoint**.  
9. **Entra ID** is not a replacement name for on-prem AD DS (different products).  
10. **Serverless** still runs on servers — you just don’t manage them.

---

## Acronym flash list

| Acronym | Meaning |
|---------|---------|
| AZ | Availability Zone |
| AVD | Azure Virtual Desktop |
| VMSS | Virtual Machine Scale Set |
| NSG | Network Security Group |
| ARM | Azure Resource Manager |
| RBAC | Role-Based Access Control |
| MFA | Multifactor Authentication |
| SSO | Single Sign-On |
| LRS/ZRS/GRS/GZRS | Storage redundancy options |
| IaC | Infrastructure as Code |
| SLA | Service Level Agreement |
| CSPM | Cloud Security Posture Management (Defender for Cloud angle) |
