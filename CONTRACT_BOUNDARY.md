# CONTRACT_BOUNDARY.md

## Purpose

Defines the hard boundary between Chayan, Sūtradhāra, and the external governance engine.
Each system has a single responsibility. Crossing these boundaries is a contract violation.

---

## System Responsibilities

### Chayan (`chayan-agent-selection`)

**Owns:**
- Mapping intent to agent IDs
- Producing `agent_selection_output`

**Must not:**
- Validate agent lifecycle state
- Apply ordering constraints
- Make governance decisions
- Know anything about the registry

---

### Sūtradhāra (`agent-sandbox` — Layer-2)

**Owns:**
- Resolving agent IDs against the registry
- Structural validation (lifecycle, duplicates, ordering)
- Assembling the ActionProposal
- Forwarding the governance request

**Must not:**
- Select agents (that is Chayan's job)
- Make governance decisions
- Produce `approved`, `reason`, or any verdict field
- Contain governance rules of any kind

---

### External Governance Engine

**Owns:**
- Evaluating the governance request
- Producing an allow / deny / escalate response

**Must not:**
- Be simulated inside Sūtradhāra
- Be called before structural validation passes
- Receive a request when `lifecycle_valid` is `false`

---

## Handoff Shapes

### Chayan → Sūtradhāra

```json
{
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "context": {}
}
```

### Sūtradhāra → Governance Engine

```json
{
  "actor": "string",
  "action": "string",
  "resource": ["string"],
  "context": {}
}
```

This object is carried inside `ActionProposal.governance_request`.
It is `null` when structural validation fails — governance is never called on an invalid chain.

### ActionProposal (Sūtradhāra output)

```json
{
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "constraints": {
    "lifecycle_valid": true
  },
  "context": {},
  "governance_request": { "actor", "action", "resource", "context" } | null
}
```

**Prohibited fields:** `approved`, `reason`, `governance_request.response`

---

## Enforcement

`validateActionProposal()` in `frontend/src/layer2/validateActionProposal.js` enforces this contract at runtime.
It returns `false` if any prohibited field is present or any required field is missing or mistyped.
