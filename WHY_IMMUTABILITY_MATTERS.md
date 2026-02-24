# Why Immutability Matters in Layer-2

## Overview

Layer-2 defines capability.
It does not execute behavior.
It does not orchestrate workflows.
It does not enforce governance.

Because Layer-2 serves as the structural boundary of what an Agent *is*, immutability is not optional — it is foundational.

---

## 1. Preserves Determinism

A deterministic system produces the same structural definition every time it is loaded.

If agent authority fields can change at runtime:

* Capability becomes unpredictable
* System behavior becomes environment-dependent
* Registry integrity is compromised

Immutability guarantees that an agent’s declared authority remains identical across sessions, users, and executions.

---

## 2. Prevents Authority Escalation

Authority fields such as:

* `authority_scope`
* `capability_type`
* `governance_eligible`
* `lifecycle_state`

must never be modified dynamically.

If mutation were allowed, a component or state handler could:

* Expand an agent’s authority
* Reclassify its capability
* Re-enable a suspended agent
* Bypass governance eligibility

Immutability prevents silent structural escalation.

---

## 3. Protects Auditability

A Layer-2 registry should be auditable.

If an agent definition can change after registration, the system loses:

* Historical clarity
* Traceable responsibility
* Structural trust

Frozen definitions ensure that what was declared is what exists.

---

## 4. Enforces Layer Separation

Layer-1: Runtime behavior
Layer-2: Capability definition

If Layer-2 objects can be mutated during runtime, Layer-1 effectively rewrites Layer-2.

This collapses architectural boundaries.

Immutability ensures that each layer maintains its responsibility.

---

## 5. Improves System Stability

Mutable shared objects are a common source of bugs:

* Side effects
* Race conditions
* State leakage
* Unexpected UI behavior

Freezing agent definitions eliminates an entire class of structural errors.

Stable structure produces stable systems.

---

## 6. Signals Architectural Discipline

Immutability communicates intent:

* Agents are declared, not negotiated.
* Capability is defined, not improvised.
* Structure is explicit, not inferred.

This discipline is critical when building layered systems where authority boundaries must remain clear.

---

## Conclusion

Immutability in Layer-2 is not about JavaScript best practices.

It is about:

* Determinism
* Authority integrity
* Auditability
* Layer separation
* System trust

Layer-2 must remain declarative and stable.

If a change requires mutation, it does not belong in Layer-2.
