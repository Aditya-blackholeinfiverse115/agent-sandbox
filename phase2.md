# Review Packet — Phase 2
## Sūtradhāra + Chayan Pipeline

---

## Entry Point

### Sūtradhāra (agent-sandbox)
**File:** `frontend/src/layer2/ActionProposal.js`
**Function:** `buildActionProposal({ actor, action, agents, context })`

Receives Chayan's `agent_selection_output` directly. Resolves agents, runs structural validation, assembles and returns the ActionProposal. This is the last thing Sūtradhāra does before handing off to governance.

### Chayan (chayan-agent-selection)
**File:** `src/pipeline.js`
**Function:** `runPipeline(intent)`

The single entry point for the full pipeline. Calls `selectAgents` then `buildActionProposal`. Returns `{ intent, selection, proposal }`. This is what the demo and replay tests call.

---

## 3 Core Files

### 1. `chayan-agent-selection/src/taskMap.js`

The only place task-to-agent mappings live. Data only — no logic, no imports.

```js
export const TASK_MAP = {
  "summarize-and-format":    ["1", "2"],
  "evaluate-and-route":      ["3", "6"],
  "translate-and-summarize": ["5", "1"],
  "classify-and-format":     ["4", "2"],
};
```

Adding a new task is one line here. Nothing else changes.

---

### 2. `agent-sandbox/frontend/src/layer2/StructuralValidator.js`

Validates the resolved agent chain before governance is contacted. Runs three checks in guaranteed order:

1. **Lifecycle** — any `lifecycle_state: "Suspended"` agent → `AGENT_SUSPENDED`
2. **Duplicates** — repeated agent IDs → `DUPLICATE_AGENTS`
3. **Ordering** — forbidden adjacent pairs → `INVALID_CHAIN`

Each error is `{ code, message }`. The `FORBIDDEN_CHAINS` table drives ordering rules — adding a new constraint is one line.

```js
const FORBIDDEN_CHAINS = [
  [3, 1], // Risk Evaluator cannot directly precede Text Summarizer
  [6, 2], // Workflow Router cannot directly precede Data Formatter
];
```

---

### 3. `agent-sandbox/frontend/src/layer2/validateActionProposal.js`

Runtime schema enforcement. Called after `buildActionProposal` to verify the contract is intact.

Rejects the proposal if:
- `approved` is present
- `reason` is present
- `governance_request.response` is present
- Any required field is missing or mistyped
- `governance_request` is absent entirely

This is the hard boundary. It cannot be bypassed.

---

## Live Flow

```
1. Intent arrives
   { actor, action, context: { task } }

2. Chayan — selectAgents(intent)
   Looks up context.task in TASK_MAP
   Returns agent_selection_output
   { actor, action, agents[], sequence[], context }

3. Sūtradhāra — buildActionProposal(selection)
   a. Resolves each agent ID against the registry
   b. If any agent is null → lifecycle_valid: false, governance_request: null
   c. Runs validateStructure on resolved agents
   d. If any error → lifecycle_valid: false, governance_request: null
   e. If valid → lifecycle_valid: true, governance_request populated

4. ActionProposal returned
   Ready for external governance engine
   No decision made inside the pipeline
```

---

## Sample JSON

### Intent Input

```json
{
  "actor": "intent-router",
  "action": "task.route",
  "context": { "task": "summarize-and-format" }
}
```

---

### agent_selection_output (Chayan)

```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["1", "2"],
  "sequence": ["1", "2"],
  "context": { "task": "summarize-and-format" }
}
```

---

### ActionProposal Output — Valid Chain (Sūtradhāra)

```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["1", "2"],
  "sequence": ["1", "2"],
  "constraints": {
    "lifecycle_valid": true
  },
  "context": { "task": "summarize-and-format" },
  "governance_request": {
    "actor": "intent-router",
    "action": "task.route",
    "resource": ["1", "2"],
    "context": { "task": "summarize-and-format" }
  }
}
```

---

### ActionProposal Output — Suspended Agent

```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["4", "2"],
  "sequence": ["4", "2"],
  "constraints": {
    "lifecycle_valid": false
  },
  "context": { "task": "classify-and-format" },
  "governance_request": null
}
```

---

### ActionProposal Output — Unknown Task

```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": [],
  "sequence": [],
  "constraints": {
    "lifecycle_valid": true
  },
  "context": { "task": "unknown.task" },
  "governance_request": {
    "actor": "intent-router",
    "action": "task.route",
    "resource": [],
    "context": { "task": "unknown.task" }
  }
}
```

---

## Failure Cases

| Scenario | `lifecycle_valid` | `governance_request` | Blocked at |
|---|---|---|---|
| Agent not found in registry | `false` | `null` | Registry resolve |
| Suspended agent in chain | `false` | `null` | `validateStructure` |
| Duplicate agent IDs | `false` | `null` | `validateStructure` |
| Risk Evaluator → Text Summarizer | `false` | `null` | `validateStructure` |
| Workflow Router → Data Formatter | `false` | `null` | `validateStructure` |
| Unknown task (empty agents) | `true` | populated (empty resource) | Not blocked — forwarded |
| Valid chain, known task | `true` | populated | Not blocked — forwarded |

Governance is never contacted when `lifecycle_valid` is `false`.
The pipeline fails closed at the structural layer.

---

## Proof

### Tests — 22 passing across both repos

```
agent-sandbox
  ActionProposal.test.js     10 tests  ✅

chayan-agent-selection
  selectAgents.test.js        6 tests  ✅
  pipeline.test.js            6 tests  ✅
```

### Replay proof — `pipeline.test.js`

Each of the 5 intent scenarios is run 10 times. Every run is serialised with `JSON.stringify` and compared byte-for-byte against the first result.

```js
const results = Array.from({ length: 10 }, () => JSON.stringify(runPipeline(intent)));
expect(results.every((r) => r === results[0])).toBe(true);
```

Same input → identical bytes → every time.

### Schema enforcement proof — `validateActionProposal`

The validator explicitly rejects `approved`, `reason`, and `governance_request.response` if present.
TC-01 through TC-04 call `validateActionProposal(proposal)` and assert `true` on both valid and failure-path proposals.

---

## Reflection

### What changed in your thinking?

The original system treated governance as something Sūtradhāra could simulate internally. The assumption was that having rules inside the system was the same as having governance. It is not. A system that simulates its own oversight has no oversight. The shift was from thinking about what the system *decides* to thinking about what the system *is responsible for knowing*. Sūtradhāra knows structure. It does not know policy.

### Where did you overstep earlier?

`simulateGovernance` was the overstep. It embedded policy rules — `task.route` allows, `system` denies, multi-agent escalates — directly inside the layer that is supposed to be neutral. That made Sūtradhāra both the validator and the judge. Those are different roles and they cannot safely live in the same place. The `approved` flag and `reason` field were symptoms of the same problem — they implied a verdict had been reached when it hadn't.

### Why separation matters?

When Chayan and Sūtradhāra are separate, each one can change without breaking the other. Task mappings are data — they belong in Chayan. Structural rules are validation — they belong in Sūtradhāra. Governance policy belongs to neither. Keeping those three concerns in three places means the system can be reasoned about, tested, and replaced in parts. A system where selection, validation, and governance all live together cannot be safely changed, because every change touches everything.
