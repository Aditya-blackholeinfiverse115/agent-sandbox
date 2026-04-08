# Review Packet — Phase 3
## Sūtradhāra (agent-sandbox)

---

## 1. Entry Point

**File:** `frontend/src/layer2/ActionProposal.js`
**Function:** `buildActionProposal({ actor, action, agents, context, _timestamp })`

Receives `agent_selection_output` from Chayan. Runs all validation gates in order. Returns a fully structured `ActionProposal` — either valid with `governance_request` populated, or failed with `failure` populated and `governance_request: null`.

---

## 2. Three Core Files

### `frontend/src/layer2/ActionProposal.js`

Orchestrates the full proposal assembly pipeline:

1. Generates deterministic `proposal_id` from input hash
2. Checks for empty chain → `EMPTY_CHAIN` failure
3. Resolves agent IDs against registry → `REGISTRY_RESOLUTION` failure if any null
4. Runs `validateStructure` → `STRUCTURAL_VALIDATION` failure if invalid
5. Returns valid proposal with `governance_request` populated

### `frontend/src/layer2/StructuralValidator.js`

Runs three checks in guaranteed order:
- Lifecycle — `AGENT_SUSPENDED`
- Duplicates — `DUPLICATE_AGENTS`
- Ordering — `INVALID_CHAIN`

Each error is `{ code, message }`. Order is deterministic: lifecycle → duplicates → chaining.

### `frontend/src/layer2/validateActionProposal.js`

Runtime schema enforcement. Returns `{ valid, errors }` where every error is `{ code, field, message }`.

Enforces: required fields, strict types, no unknown fields, `governance_request` always present, `failure` shape correct, no decision fields (`approved`, `reason`, `governance_request.response`).

---

## 3. Full Pipeline Flow

```
Intent
  └─→ Chayan — selectAgents(intent)
        └─→ agent_selection_output
              { actor, action, agents, sequence, context, selection_metadata }
                  └─→ Sūtradhāra — buildActionProposal(selection)
                        │
                        ├─ agents.length === 0?
                        │     └─→ EMPTY_CHAIN failure
                        │
                        ├─ any agent unresolved in registry?
                        │     └─→ REGISTRY_RESOLUTION failure
                        │
                        ├─ validateStructure fails?
                        │     └─→ STRUCTURAL_VALIDATION failure
                        │
                        └─ all pass
                              └─→ ActionProposal (lifecycle_valid: true)
                                      └─→ Mandala / RAJYA
```

On any failure: `governance_request: null`, `failure: { stage, codes[], message }`.
On success: `failure: null`, `governance_request: { actor, action, resource, context }`.

---

## 4. Sample JSON

### Success — valid chain

```json
{
  "proposal_id": "ap-3f2a1b",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "contract_version": "v1.1",
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["1", "2"],
  "sequence": ["1", "2"],
  "constraints": { "lifecycle_valid": true },
  "context": { "task": "summarize-and-format" },
  "failure": null,
  "governance_request": {
    "actor": "intent-router",
    "action": "task.route",
    "resource": ["1", "2"],
    "context": { "task": "summarize-and-format" }
  }
}
```

### Failure — suspended agent

```json
{
  "proposal_id": "ap-7c4d9e",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "contract_version": "v1.1",
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["4", "2"],
  "sequence": ["4", "2"],
  "constraints": { "lifecycle_valid": false },
  "context": { "task": "classify-and-format" },
  "failure": {
    "stage": "STRUCTURAL_VALIDATION",
    "codes": ["AGENT_SUSPENDED"],
    "message": "Suspended agent detected: 4"
  },
  "governance_request": null
}
```

### Failure — empty chain

```json
{
  "proposal_id": "ap-1a2b3c",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "contract_version": "v1.1",
  "actor": "intent-router",
  "action": "task.route",
  "agents": [],
  "sequence": [],
  "constraints": { "lifecycle_valid": false },
  "context": { "task": "unknown.task" },
  "failure": {
    "stage": "EMPTY_CHAIN",
    "codes": ["EMPTY_AGENT_CHAIN"],
    "message": "No agents provided — an empty chain cannot be executed"
  },
  "governance_request": null
}
```

---

## 5. Failure Cases

| Scenario | Stage | Codes | `governance_request` |
|---|---|---|---|
| `agents = []` | `EMPTY_CHAIN` | `["EMPTY_AGENT_CHAIN"]` | `null` |
| Agent ID not in registry | `REGISTRY_RESOLUTION` | `["AGENT_NOT_FOUND"]` | `null` |
| Suspended agent | `STRUCTURAL_VALIDATION` | `["AGENT_SUSPENDED"]` | `null` |
| Duplicate agent IDs | `STRUCTURAL_VALIDATION` | `["DUPLICATE_AGENTS"]` | `null` |
| Risk Evaluator → Text Summarizer | `STRUCTURAL_VALIDATION` | `["INVALID_CHAIN"]` | `null` |
| Workflow Router → Data Formatter | `STRUCTURAL_VALIDATION` | `["INVALID_CHAIN"]` | `null` |
| Multiple violations | `STRUCTURAL_VALIDATION` | `["AGENT_SUSPENDED", "DUPLICATE_AGENTS"]` | `null` |
| Valid chain | — | — | populated |

---

## 6. Proof

### Test run

```
agent-sandbox
  ActionProposal.test.js    22 tests   ✅

chayan-agent-selection
  selectAgents.test.js       8 tests   ✅
  pipeline.test.js           6 tests   ✅
  pipeline_replay.test.js    9 tests   ✅

Total: 45 tests — all pass
```

### Key test assertions

**TC-04** — suspended agent produces exact `failure` object:
```js
expect(proposal.failure).toEqual({
  stage: "STRUCTURAL_VALIDATION",
  codes: ["AGENT_SUSPENDED"],
  message: "Suspended agent detected: 4",
});
expect(proposal.governance_request).toBeNull();
```

**TC-17** — multi-error: both codes collected:
```js
expect(proposal.failure.codes).toContain("AGENT_SUSPENDED");
expect(proposal.failure.codes).toContain("DUPLICATE_AGENTS");
```

**TC-19** — empty chain is explicit failure:
```js
expect(proposal.failure.stage).toBe("EMPTY_CHAIN");
expect(proposal.governance_request).toBeNull();
```

**RPT-01** — `proposal_id` identical across 20 runs:
```js
expect(allEqual(runs, (r) => r.proposal.proposal_id)).toBe(true);
```

**RPT-05** — failure object identical across 20 runs:
```js
expect(allEqual(runs, (r) => r.proposal.failure)).toBe(true);
```

**RPT-07** — different inputs produce different `proposal_id`:
```js
expect(a.proposal.proposal_id).not.toBe(b.proposal.proposal_id);
```
