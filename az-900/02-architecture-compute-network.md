# Domain 2a: Core architecture, compute (IaaS focus), networking

Largest exam slice overall is **architecture and services (35–40%)**. This file covers the parts you should drill hardest: hierarchy, IaaS compute, and networking. PaaS hosting options are short.

---

## 2.1 Core architectural components

### Physical / geographic

| Term | What it is |
|------|------------|
| **Region** | Geographic area with one or more datacenters (e.g. East US) |
| **Region pair** | Two regions in the same geography, paired for DR / planned updates (paired region updates staggered) |
| **Availability Zone (AZ)** | Physically separate datacenters *within* a region; independent power/network/cooling |
| **Datacenter** | Physical facility housing servers |
| **Sovereign region** | Isolated clouds for government/compliance (e.g. Azure Government, Azure China operated with 21Vianet) |

**Exam tip**

- Protect against *datacenter* failure in a region → use **Availability Zones**.
- Protect against *region* failure → multi-region / region pairs / geo-redundant storage.
- Sovereign clouds ≠ “just another commercial region” — compliance/isolation angle.

### Management hierarchy (top → bottom)

```
Management groups
 └── Subscriptions
      └── Resource groups
           └── Resources
```

| Level | Purpose |
|-------|---------|
| **Management group** | Organize subscriptions; apply policy/RBAC across many subs |
| **Subscription** | Billing boundary + scale limits; ties to Azure AD (Entra) tenant |
| **Resource group** | Logical container for related resources (lifecycle/deploy/RBAC scope) |
| **Resource** | Single manageable item (VM, NIC, disk, VNet, etc.) |

Rules of thumb:

- A resource lives in **one** resource group and **one** region (RGs themselves are “meta” — resources inside can be different regions, but you’re usually consistent).
- Deleting a resource group deletes its resources.
- Tags + Policy often apply at subscription / RG / management group scopes.

---

## 2.2 Compute — compare types

| Type | Abstraction | When exam picks it |
|------|-------------|--------------------|
| **Virtual machines** | Full OS (IaaS) | Custom OS, lift-shift, total control |
| **Containers** | App + deps, share host kernel | Portable microservices; denser than VMs |
| **Functions (serverless)** | Code triggered by events | Short-lived, event-driven, no server manage |

Containers in Azure (know names, not deep config):

- **Azure Container Instances (ACI)** — simple, no orchestrator
- **Azure Kubernetes Service (AKS)** — managed Kubernetes (orchestration)
- **Azure Container Apps** — serverless containers (sometimes appears in newer materials)

---

## 2.3 IaaS deep dive (study heavily)

### Azure Virtual Machines

IaaS VMs need (you should be able to list these):

- Compute (size / series)
- Storage (OS disk, optional data disks)
- Networking (VNet, subnet, NIC; often public IP + NSG)
- Identity/access (credentials, Entra/SSO options, keys)

Also know:

- Images from **Marketplace**, custom images, or generalized images.
- **Scale sets / availability** options below.

### Virtual Machine Scale Sets (VMSS)

- Identical VMs that **scale out/in** automatically or manually.
- Good for: web tiers, high scale, auto-scale with load.

### Availability sets (contrast with zones)

| Feature | Availability set | Availability zone |
|---------|------------------|-------------------|
| Fault domains | Separate racks/power within a datacenter | Separate *datacenters* |
| Scope | Single datacenter / region logic | Multiple zones in a region |
| Use | Legacy / when zones unavailable | Preferred for zone-redundant HA |

**Exam:** Zone-redundant apps in a region → **Availability Zones** (and zone-redundant services). Availability sets = update + fault domains *inside* a datacenter.

### Azure Virtual Desktop (AVD)

- Desktop and app virtualization **as a service** (multi-session Windows in Azure).
- Exam: “secure remote desktop from anywhere without VPN to every PC” → often AVD.

### Resources required for a VM (checklist)

1. Resource group  
2. VM size / image  
3. Disks  
4. Virtual network + subnet  
5. Network interface  
6. (Optional) Public IP, NSG, Load Balancer, availability zone/set  

---

## 2.4 Application hosting options (PaaS — light pass)

Know enough to *choose* the right option:

| Option | Model | Pick when |
|--------|-------|-----------|
| **Azure Virtual Machines** | IaaS | Full OS control |
| **Azure App Service (Web Apps)** | PaaS | HTTP apps, managed platform, little OS care |
| **Containers (ACI / AKS / Container Apps)** | Between | Packaged apps, microservices |
| **Azure Functions** | Serverless | Events, APIs, timers |

You don’t need deep App Service config for AZ-900 — just recognize PaaS hosting vs VMs.

---

## 2.5 Networking (study heavily)

### Azure Virtual Network (VNet)

- Isolated private IP space in Azure (like your own network in the cloud).
- **Subnets** segment the VNet (workload tiers, private endpoints, gateways).
- Resources in the same VNet can communicate by default (subject to NSGs).

### Peering

- **VNet peering** connects two VNets (same or different regions with **global peering**).
- Traffic stays on Microsoft backbone (not public internet).
- Peered VNets are non-transitive by default (A↔B and B↔C does **not** imply A↔C).

### Azure DNS

- Host DNS zones/records in Azure.
- Private DNS zones for name resolution inside VNets.

### Connecting on-premises ↔ Azure

| Option | Characteristics |
|--------|-----------------|
| **VPN Gateway** (Site-to-Site / Point-to-Site) | Encrypted tunnel over the **public internet**; faster to set up; bandwidth limits |
| **ExpressRoute** | Private dedicated connection via connectivity partner; higher reliability/bandwidth; **not** over public internet |

**Exam favorites**

- Need private, predictable, high bandwidth → **ExpressRoute**
- Need encrypted hybrid over internet → **VPN Gateway**
- User laptop to Azure without full site VPN → **Point-to-Site VPN** (or AVD for desktops)

### Public vs private endpoints

| Endpoint | Meaning |
|----------|---------|
| **Public endpoint** | Reachable via public IP / public internet (lock down with firewalls, NSGs, Private Link alternatives) |
| **Private endpoint** | NIC with private IP in *your* VNet that maps to a PaaS service (Private Link) — traffic stays private |

Related: **service endpoints** (older pattern — secure PaaS to VNet over Azure backbone with public IP still involved) vs **private endpoints** (private IP in your VNet). AZ-900 mainly wants you to know **public vs private** and why private endpoints improve security.

### Other networking names worth recognizing

- **Network Security Group (NSG)** — allow/deny rules on subnet or NIC  
- **Azure Firewall** — managed network firewall  
- **Azure Load Balancer** — Layer 4 load distribution  
- **Application Gateway** — Layer 7 HTTP(S), WAF option  
- **Azure Bastion** — RDP/SSH via portal without public IP on the VM  
- **DDoS Protection** — platform + Standard protection options  

NSG vs Firewall vs App Gateway shows up as “which filter?” scenarios.

---

## Checkpoint questions

1. Management group vs subscription — which is the billing boundary?
2. AZ vs region pair — which mitigates loss of an entire region?
3. VMSS vs Availability Set — which auto-scales instance count?
4. VPN Gateway vs ExpressRoute — which does *not* traverse the public internet?
5. What does a private endpoint give you that a public PaaS endpoint does not?
6. Are VNet peerings transitive?
