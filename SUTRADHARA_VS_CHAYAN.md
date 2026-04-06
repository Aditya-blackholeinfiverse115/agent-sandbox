# SUTRADHARA_VS_CHAYAN.md

## Overview

Two systems, two responsibilities, one pipeline.

| | Chayan | Sūtradhāra |
|---|---|---|
| Repo | `chayan-agent-selection` | `agent-sandbox` |
| Layer | Upstream (selection) | Layer-2 (validation + assembly) |
| Input | Intent object | Chayan's `agent_selection_output` |
| Output | `agent_selection_output` | `ActionProposal` |
| Knows about registry | No | Yes |
| Makes governance decisions | No | No |
| Runs structural validation | No | Yes |

---

## Chayan

**Single job:** map a task to an ordered list of agent IDs.

**Entry point:** `selectAgents(intent)`

**Input:**
```json
{ "actor": "intent-router", "action": "task.route", "context": { "task": "summarize-and-format" } }
```

**Output:**
```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["1", "2"],
  "sequence": ["1", "2"],
  "context": { "task": "summarize-and-format" }
}
```

**How it works:** pure table lookup in `TASK_MAP`. No registry access, no validation, no rules.

**Unknown task:** returns `agents: []` — does not throw, does not block.

---

## Sūtradhāra

**Single job:** validate the agent chain and assemble a governance-ready ActionProposal.

**Entry point:** `buildActionProposal({ actor, action, agents, context })`

**Input:** Chayan's output (passed directly — shapes are compatible by design).

**Output (valid chain):**
```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["1", "2"],
  "sequence": ["1", "2"],
  "constraints": { "lifecycle_valid": true },
  "context": { "task": "summarize-and-format" },
  "governance_request": {
    "actor": "intent-router",
    "action": "task.route",
    "resource": ["1", "2"],
    "context": { "task": "summarize-and-format" }
  }
}
```

**Output (invalid chain):**
```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["4", "2"],
  "sequence": ["4", "2"],
  "constraints": { "lifecycle_valid": false },
  "context": { "task": "classify-and-format" },
  "governance_request": null
}
```

**How it works:**
1. Resolves agent IDs against the registry
2. Runs `validateStructure` — lifecycle, duplicates, ordering
3. If valid: assembles proposal with `governance_request` populated
4. If invalid: assembles proposal with `governance_request: null`

---

## Why They Are Separate

Chayan does not need to know if an agent is suspended. That is registry knowledge — Sūtradhāra's domain.

Sūtradhāra does not need to know which agents belong to which task. That is selection knowledge — Chayan's domain.

Keeping them separate means:
- Task mappings change in one place (`taskMap.js`) without touching validation
- Validation rules change in one place (`StructuralValidator.js`) without touching selection
- Either system can be replaced independently without breaking the other

---

## Integration Point

`runPipeline(intent)` in `chayan-agent-selection/src/pipeline.js` is the current integration surface.
It calls `selectAgents` then `buildActionProposal` and returns `{ intent, selection, proposal }`.

When the live intent router is available, `intentRouterMock.js` in agent-sandbox is the only file that changes.
When the live governance engine is available, `governanceInterface.js` in agent-sandbox is the only file that changes.
