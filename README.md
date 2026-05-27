# n8n-nodes-bigip-f5

An [n8n](https://n8n.io) community node for automating F5 **BIG-IP** appliances via the [iControl REST API](https://clouddocs.f5.com/api/icontrol-rest/).

Automate pool management, WAF policy lifecycle, APM session control, and system operations — directly from your n8n workflows.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-bigip-f5)](https://www.npmjs.com/package/n8n-nodes-bigip-f5)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-orange)](https://docs.n8n.io/integrations/community-nodes/)

---

## Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Credentials](#credentials)
- [Resources and Operations](#resources-and-operations)
  - [LTM — Local Traffic Manager](#ltm--local-traffic-manager)
  - [ASM — Application Security Manager](#asm--application-security-manager)
  - [APM — Access Policy Manager](#apm--access-policy-manager)
  - [System](#system)
  - [Authentication](#authentication)
- [Compatibility](#compatibility)
- [Development](#development)
- [License](#license)

---

## Prerequisites

- An F5 BIG-IP appliance or VE running **TMOS 13.1 or later** with the iControl REST API enabled.
- An n8n instance (self-hosted or cloud) running **n8n 1.0 or later**.
- A BIG-IP user account with sufficient privileges for the operations you intend to automate (at minimum, the `Operator` role; `Administrator` for system-level operations).

---

## Installation

### In n8n (recommended)

1. Open your n8n instance and go to **Settings → Community Nodes**.
2. Click **Install a community node**.
3. Enter `n8n-nodes-bigip-f5` and click **Install**.

### Self-hosted via npm

```bash
cd ~/.n8n
npm install n8n-nodes-bigip-f5
```

Then restart n8n.

---

## Credentials

Create a **BIG-IP F5 API** credential in n8n with the following fields:

| Field | Description | Example |
|---|---|---|
| **Host** | Base URL of the BIG-IP, including protocol | `https://192.168.1.245` |
| **Username** | BIG-IP admin username | `admin` |
| **Password** | BIG-IP admin password | *(masked)* |
| **Ignore SSL Certificate Errors** | Skip TLS validation (useful for appliances with self-signed certs) | `true` |

> **Note:** The node uses HTTP Basic Authentication for every request. To use token-based auth instead, call the **Authentication → Request Token** operation first, then pass the returned token via the HTTP Request node with the `X-F5-Auth-Token` header.

---

## Resources and Operations

### LTM — Local Traffic Manager

Manage load-balancing pools and virtual servers.

| Operation | Description |
|---|---|
| **Discover Resources** | List all available LTM resource links on the BIG-IP |
| **Get All Pools** | Retrieve all configured LTM pools |
| **Create Pool** | Create a new pool with optional members, monitor, and load-balancing mode |
| **Update Pool** | Update members, monitor, description, or load-balancing mode on an existing pool |
| **Get Pool Stats** | Retrieve real-time connection statistics for a pool |
| **Reset Virtual Server Stats** | Reset cumulative statistics for a named virtual server |

**Supported load-balancing modes:** Round Robin, Least Connections (Member/Node), Fastest (App/Node), Observed (Member/Node), Predictive (Member/Node), Ratio (Member/Node/Session), Weighted Least Connections (Member/Node).

**Pool name format:** Use the full path including partition, e.g. `~Common~my_pool`.

---

### ASM — Application Security Manager

Manage WAF policies, attack signatures, and vulnerability assessments.

| Operation | Description |
|---|---|
| **Apply Policy** | Enforce a WAF policy (provide the policy self-link) |
| **Check Task Status** | Poll the status of any long-running ASM background task |
| **Diff Policies** | Find differences between two WAF policies |
| **Export Policy** | Export a policy to a declarative JSON or XML file on the BIG-IP |
| **Export Signatures** | Export the current attack signature set to a file |
| **Import Policy** | Restore a WAF policy from a revision history reference |
| **Import Vulnerabilities** | Import vulnerability scan results from an external scanner |
| **Initiate Vulnerability Assessment** | Trigger a new vulnerability assessment scan |
| **Merge Policies** | Apply changes from a diff task back into target policies |
| **Publish Policy** | Publish pending changes to make a policy active |
| **Terminate Vulnerability Assessment** | Stop a running vulnerability assessment scan |
| **Update Signatures** | Update the attack signature database from a file or live feed |

**Tip:** Long-running operations (import, export, update signatures, vulnerability assessment) return a task ID. Use **Check Task Status** to poll for completion.

---

### APM — Access Policy Manager

Manage user sessions, access policies, OAuth tokens, and reports.

| Operation | Description |
|---|---|
| **Get All Sessions** | List all active APM user sessions |
| **Delete Session** | Terminate a specific user session |
| **Get Access Policy** | Retrieve an access policy by ID |
| **Update Access Policy** | Modify an access policy's name or description |
| **Delete Access Policy** | Permanently delete an access policy |
| **Get OAuth Token Statistics** | Get a summary count of active OAuth tokens |
| **Revoke OAuth Token** | Immediately revoke an OAuth access token |
| **Get Reports** | Retrieve all resources in the APM report collection |

---

### System

Perform system-level operations on the BIG-IP.

| Operation | Description |
|---|---|
| **Reboot** | Reboot the BIG-IP device |
| **Save Configuration** | Write the current running configuration to disk |
| **Restart Service** | Restart a named system service (e.g. `icrd`, `mcpd`, `tmm`) |
| **Ping** | Run a ping command from the BIG-IP management plane |
| **Get Software Images** | List all software installation images on the device |
| **Get Software Volumes** | List all disk volumes used by software installations |
| **Download UCS File** | Download an existing UCS (User Configuration Set) backup |
| **Create UCS Task** | Initiate a UCS backup (`save`) or restore (`load`) task |
| **Execute CLI Command** | Run a TMSH or shell command via the REST API |

> **Warning:** **Reboot** immediately restarts the appliance. Ensure no critical traffic is running through it before executing this operation.

---

### Authentication

Manage iControl REST authentication tokens.

| Operation | Description |
|---|---|
| **Request Token** | Authenticate with username and password to obtain a REST token |
| **Get Token Details** | Retrieve metadata and expiry information for an existing token |
| **Get Modules** | Discover all licensed and provisioned modules on the BIG-IP |

---

## Compatibility

| Requirement | Version |
|---|---|
| n8n | ≥ 1.0.0 |
| Node.js | ≥ 18 |
| BIG-IP TMOS | ≥ 13.1 (iControl REST) |

This node uses the **declarative routing** style introduced in n8n 0.190 and does not require a custom `execute()` function.

---

## Development

### Setup

```bash
git clone https://github.com/kboykov/n8n-nodes-bigip-f5.git
cd n8n-nodes-bigip-f5
npm install
```

### Build

```bash
npm run build        # compile TypeScript to dist/
npm run build:watch  # watch mode
```

### Lint

```bash
npm run lint         # check for issues
npm run lint:fix     # auto-fix where possible
```

### Test locally in n8n

```bash
npm run dev          # build and link the node into a local n8n instance
```

### Publish a new release

```bash
npm run release      # interactive: bumps version, tags, pushes → triggers GitHub Actions
```

Publishing to npm requires the GitHub Actions workflow at `.github/workflows/publish.yml`. See the comments inside that file for the one-time npm Trusted Publisher setup.

---

## License

[MIT](LICENSE.md) © Kristiyan Boykov
