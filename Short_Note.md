# Short Notes:

## 1. What Structural Weakness Existed in Task 1?

Task 1 lacked **formal structural discipline**.

- Agents were implicitly defined rather than contract-bound.
- There was no strict schema enforcing immutability.
- Identity and authority were not structurally protected.
- Behavior could drift because nothing formally constrained agent shape.
- The system relied more on UI/state assumptions than on contract guarantees.

In short:  
**Agents were objects — not governed entities.**

---

## 2. What Is Now More Deterministic?

With the Layer-2 Agent Contract:

- Agent identity (`id`) is immutable.
- Core fields (`name`, `description`, `authority_scope`) are frozen.
- Capability classification is explicitly defined.
- Lifecycle state is formally modeled (`Active / Deprecated / Suspended`).
- Visibility and load behavior are structurally declared.

Now:
- Agent validity is schema-driven.
- Structure precedes behavior.
- Registry logic becomes predictable.
- Governance simulation has a stable foundation.

The system now favors **structural determinism over runtime improvisation.**

---

## 3. What Still Feels Fragile?

Despite stronger structure, some fragility remains:

- Governance logic is still UI-simulated, not structurally enforced.
- Agent chaining does not yet enforce capability compatibility.
- Lifecycle transitions may not be fully guarded.
- Integration-level constraints between agents are still conceptual.

In essence:
- The contract is strong.

---

## Summary

Task 1 was flexible but structurally loose.  
Layer-2 introduces determinism through immutability and formal schema.