# REVIEW_PACKET.md

## What Was Built

A deterministic two-system pipeline spanning two repositories:

- **Chayan** (`chayan-agent-selection`) — maps intent to agent selection
- **Sūtradhāra** (`agent-sandbox`) — validates agent chains and produces a governance-ready ActionProposal

No governance decisions are made inside either system. The pipeline produces a request, not a verdict.

---

## Repositories

| Repo | Role |
|---|---|
| `agent-sandbox` | Sūtradhāra — Layer-2 structural validation + ActionProposal assembly |
| `chayan-agent-selection` | Chayan — intent-to-agent mapping, pipeline runner, replay tests |

---

## Full Pipeline Flow

```
mock intent
  → selectAgents()          [Chayan — taskMap lookup]
  → buildActionProposal()   [Sūtradhāra — registry resolve + structural validation]
  → ActionProposal          [governance_request populated, no decision made]
```

---

## ActionProposal Schema (current)

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
  "governance_request": {
    "actor": "string",
    "action": "string",
    "resource": ["string"],
    "context": {}
  }
}
```

**Invariants enforced by `validateActionProposal`:**
- `approved` must not be present
- `reason` must not be present
- `governance_request.response` must not be present
- `governance_request` is always present — `null` when structure fails, populated when valid

---

## Core Files — Sūtradhāra (`agent-sandbox`)

### `frontend/src/layer2/ActionProposal.js` — `buildActionProposal()`

1. Resolves all agent IDs via `RegistryInterface.getAgentById`
2. Returns early with `lifecycle_valid: false`, `governance_request: null` if any agent is unresolved
3. Calls `validateStructure` — returns early with same failure shape if invalid
4. Assembles and returns the full ActionProposal with `governance_request` populated

### `frontend/src/layer2/StructuralValidator.js` — `validateStructure()`

Runs three checks in deterministic order:

1. **Lifecycle** — blocks any agent with `lifecycle_state: "Suspended"` → `AGENT_SUSPENDED`
2. **Duplicates** — blocks repeated agent IDs → `DUPLICATE_AGENTS`
3. **Ordering** — blocks forbidden adjacent pairs → `INVALID_CHAIN`

Each error is `{ code, message }`. Order is guaranteed: lifecycle → duplicates → chaining.

Forbidden chains:
- `Risk Evaluator (id:3)` cannot directly precede `Text Summarizer (id:1)`
- `Workflow Router (id:6)` cannot directly precede `Data Formatter (id:2)`

### `frontend/src/layer2/GovernanceHandshake.js` — `buildGovernanceRequest()`

Pure passthrough. Returns `{ actor, action, resource, context }`. No rules, no response.

### `frontend/src/layer2/governanceInterface.js` — `submitGovernanceRequest()`

External governance hook stub. Accepts a request, returns `{ received: true, request, response: null }`. Integration target for live governance engine.

### `frontend/src/layer2/validateActionProposal.js` — `validateActionProposal()`

Runtime schema enforcement. Returns `false` if any decision field is present or any required field is missing or mistyped.

---

## Core Files — Chayan (`chayan-agent-selection`)

### `src/taskMap.js`

Static mapping of task identifiers to ordered agent ID arrays. Data only — no logic.

```js
"summarize-and-format"    → ["1", "2"]
"evaluate-and-route"      → ["3", "6"]
"translate-and-summarize" → ["5", "1"]
"classify-and-format"     → ["4", "2"]
```

### `src/selectAgents.js` — `selectAgents(intent)`

Looks up `context.task` in `TASK_MAP`. Returns `agent_selection_output`:
`{ actor, action, agents, sequence, context }`. Unknown tasks return `agents: []`.

### `src/pipeline.js` — `runPipeline(intent)`

Wires `selectAgents` → `buildActionProposal`. Returns `{ intent, selection, proposal }`.

---

## Failure Scenarios

| Scenario | `lifecycle_valid` | `governance_request` |
|---|---|---|
| Agent not found in registry | `false` | `null` |
| Suspended agent in chain | `false` | `null` |
| Duplicate agents | `false` | `null` |
| Invalid chain ordering | `false` | `null` |
| Unknown task (empty agents) | `true` | populated (empty resource) |
| Valid chain, known task | `true` | populated |

---

## Test Coverage

| Suite | File | Tests |
|---|---|---|
| ActionProposal + schema | `ActionProposal.test.js` | 10 |
| Agent selection | `selectAgents.test.js` | 6 |
| Pipeline replay (determinism) | `pipeline.test.js` | 6 |
| **Total** | | **22** |

All 22 tests pass. Run with `npm test` in each repo.
