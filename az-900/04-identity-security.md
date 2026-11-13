# Domain 2c: Identity, access, and security

High weight inside architecture/services. Easy to lose points if you only studied compute/network.

---

## Directory services

| Service | Role |
|---------|------|
| **Microsoft Entra ID** (formerly Azure AD) | Cloud identity & access management: users, groups, apps, SSO, Conditional Access |
| **Microsoft Entra Domain Services** | Managed domain controllers in Azure (Kerberos/NTLM/LDAP) without running your own DCs — for legacy apps needing classic AD features |

**Exam tip:** Entra ID ≠ Windows Server Active Directory Domain Services. Entra Domain Services is the managed bridge for domain-join style needs in Azure.

---

## Authentication methods

| Method | Idea |
|--------|------|
| **SSO (single sign-on)** | Sign in once; access many apps |
| **MFA** | Something you know + have/are (password + app/phone/FIDO) |
| **Passwordless** | Windows Hello, FIDO2 keys, Microsoft Authenticator passwordless — no traditional password |

### External identities

- **Guest / B2B** users collaborate in your directory (partners).
- **External ID / B2C** style scenarios: customers signing into *your* apps (exam may say “external identities” broadly).

Know: guests can be invited; Conditional Access can still apply.

---

## Conditional Access

Policy engine: **if** signal (user, location, device, risk, app) **then** control (block, require MFA, require compliant device).

Built on signals from Entra ID (and often Microsoft Defender / Intune compliance).

**Exam cue:** “Require MFA only when outside corporate network” → Conditional Access.

---

## Azure RBAC (role-based access control)

- Controls **authorization** to manage Azure resources (who can create VMs, read a storage account, etc.).
- Scope hierarchy: management group → subscription → resource group → resource.
- Built-in roles: **Owner**, **Contributor**, **Reader**, **User Access Administrator**, plus many service-specific roles.
- Roles = actions on resource types; assignments attach role + principal + scope.

Contrast:

| Concept | Answers |
|---------|---------|
| **Authentication** | Who are you? |
| **Authorization (RBAC)** | What Azure resources may you manage? |
| **Entra app permissions** | What can an app do in Microsoft Graph / APIs? |

---

## Zero Trust

Guiding model: **never trust, always verify**.

Core principles (Microsoft’s framing):

1. Verify explicitly (identity + device + context)  
2. Use least privilege access  
3. Assume breach (segment, encrypt, monitor)  

Not a single product — a strategy implemented with Entra, Conditional Access, Defender, Privileged Identity Management patterns, network segmentation, etc.

---

## Defense in depth

Layered security so one failure doesn’t compromise everything.

Typical Azure layers (outer → inner conceptually):

1. Physical security (datacenters — Microsoft)  
2. Identity & access  
3. Perimeter (DDoS, edge firewalls)  
4. Network (NSG, Firewall, segmentation)  
5. Compute (hardened OS, updates)  
6. Application  
7. Data (encryption at rest/in transit, classification)  

**Exam:** “multiple security layers” → defense in depth.

---

## Microsoft Defender for Cloud

- Cloud security posture management (CSPM) + cloud workload protection.
- Secure Score, recommendations, threat detection for Azure (and hybrid/multi-cloud with connectors).
- Exam: improve security posture / recommendations / threat protection → **Defender for Cloud** (not Azure Advisor — Advisor is broader best-practice including cost/perf).

Related names you may see:

- **Microsoft Defender for Cloud Apps** (formerly CASB) — different product; AZ-900 mainly wants Defender for Cloud’s purpose.
- Encryption: platform encryption, customer-managed keys (Key Vault) — know Key Vault stores secrets/keys/certs.

---

## Checkpoint questions

1. Entra ID vs Entra Domain Services — which gives managed Kerberos/LDAP domain join?
2. MFA vs Conditional Access — which *decides when* MFA is required based on signals?
3. Contributor vs Reader — who can deploy a VM?
4. Is Zero Trust a product you enable with one toggle?
5. Advisor vs Defender for Cloud — which focuses on security posture and threats?
