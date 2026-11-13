# Domain 2b: Azure storage services

Storage is a high-yield AZ-900 topic. Learn the **service types**, **tiers**, **redundancy letters**, and **copy/migrate tools**.

---

## Storage services compared

All of these live in an **Azure Storage account** (except when a service has its own dedicated product — exam focuses on Storage account services first).

| Service | Best for | Access pattern |
|---------|----------|----------------|
| **Blob storage** | Unstructured objects (files, images, backups, data lake) | HTTP(S); containers + blobs |
| **Azure Files** | SMB/NFS file shares (lift-shift file servers) | Mount like a file share |
| **Queue storage** | Reliable messaging between app components | Messages in queues |
| **Table storage** | NoSQL key-attribute store (simple) | Entity queries |
| **Disks** (managed disks) | OS/data disks for VMs | Attached to VMs (IaaS) |

Also recognize:

- **Azure Data Lake Storage Gen2** — blob + hierarchical namespace (analytics). Often marketed with Blob.
- **Managed disks** types: Standard HDD, Standard SSD, Premium SSD, Ultra Disk (performance tiers).

---

## Storage account options / types

Know at a high level:

| Kind / feature | Notes |
|----------------|-------|
| **General-purpose v2 (GPv2)** | Default recommendation; blobs, files, queues, tables |
| **BlobStorage / BlockBlob** | Older/specialized; prefer GPv2 unless told otherwise |
| Access tiers on blobs (below) | Hot / Cool / Cold / Archive |
| **Premium** performance | Low latency (Premium block blobs, file shares, page blobs for disks) |

**Exam:** “cheapest long-term rarely accessed archive” → **Archive** tier (higher retrieval cost/latency).

---

## Blob access tiers

| Tier | Use |
|------|-----|
| **Hot** | Frequently accessed |
| **Cool** | Infrequent; stored ≥ ~30 days typical guidance |
| **Cold** | Even less frequent (newer tier — know it exists if materials include it) |
| **Archive** | Rarely accessed; offline/rehydrate delay; lowest storage cost |

Lifecycle management policies can auto-move tiers.

---

## Redundancy options (memorize)

| Option | Copies | Failure coverage |
|--------|--------|------------------|
| **LRS** Locally Redundant Storage | 3 copies in one datacenter | Disk/rack failures in one DC |
| **ZRS** Zone-Redundant Storage | Copies across AZs in a region | Datacenter (zone) failure |
| **GRS** Geo-Redundant Storage | LRS in primary + async to secondary region | Region failure (async) |
| **GZRS** Geo-Zone-Redundant | ZRS in primary + async to secondary | Zone + region |
| **RA-GRS / RA-GZRS** | Same as GRS/GZRS + **read access** to secondary | Read if primary down |

**Exam cues**

- Cheapest / single DC → **LRS**  
- Survive zone outage in-region → **ZRS**  
- Survive region outage → **GRS** or **GZRS**  
- Read from secondary anytime → **RA-*** variants  

---

## Moving files / sync tools

| Tool | Purpose |
|------|---------|
| **AzCopy** | CLI for high-performance copy to/from Azure Storage |
| **Azure Storage Explorer** | GUI to browse/upload/download storage |
| **Azure File Sync** | Sync on-prem Windows file servers with Azure Files (cloud tiering) |

---

## Migration options

| Tool | Purpose |
|------|---------|
| **Azure Migrate** | Discovery, assessment, migration of VMs/apps/databases to Azure |
| **Azure Data Box** | Physical appliance/disks shipped to Microsoft for large offline data import/export (when network transfer is impractical) |

**Exam:** petabytes over a slow WAN → **Data Box**. Assessing on-prem VMs for cloud readiness → **Azure Migrate**.

---

## Quick associations

- SMB share in the cloud → **Azure Files**  
- Images/videos/backups → **Blobs**  
- Decouple web front end from worker → **Queues**  
- VM OS disk → **Managed disk** (not Blob as the primary mental model for the exam, though page blobs underpin some disk types)  

---

## Checkpoint questions

1. LRS vs ZRS — what failure does ZRS protect against that LRS does not?
2. Hot vs Archive — which has the lowest storage price and highest retrieval friction?
3. AzCopy vs Storage Explorer — which is CLI-oriented for scripting/bulk?
4. When would you pick Data Box over AzCopy over the internet?
