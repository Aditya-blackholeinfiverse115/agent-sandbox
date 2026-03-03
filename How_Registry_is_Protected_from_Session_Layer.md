# How Registry is Protected from Session Layer

## Architectural Separation

The system is intentionally divided into two distinct layers:

### Layer 2 — Agent Registry (Immutable Capability Layer)
Defines agent contracts and structural metadata.
Agents are created using `createAgentContract()` and recursively frozen using deep immutability enforcement.

### Layer 3 — Session Runtime (Mutable Interaction Layer)
Manages user interaction state and runtime metadata only.

The Session Layer never mutates or stores registry agent objects.

---

## What the Session Layer Stores

The session reducer maintains only primitive runtime structures:

* `selectedAgentIds`
* `runtimeLoadById`
* `governanceOverrides`

All runtime behavior references agents by **ID only**.

No agent objects are stored in session state.

---

## What the Session Layer Does NOT Do

The session layer:

* Does not import or modify `AgentRegistry`
* Does not mutate agent fields
* Does not spread agent objects and attach runtime properties
* Does not override contract fields like:

  * `authority_scope`
  * `lifecycle_state`
  * `governance_eligible`

Runtime state is maintained separately and mapped by ID.

---

## Enforcement Mechanisms

Registry protection is guaranteed through:

1. Deep immutability via `deepFreeze()`
2. Read-only access through `RegistryInterface`
3. ID-based referencing from the session layer
4. No direct registry imports in session reducer
5. Runtime Stress Simulation proving mutation attempts fail

---

## Result

The Agent Registry remains:

* Deterministic
* Immutable
* Structurally isolated
* Protected from runtime contamination

Session activity cannot alter capability definitions.