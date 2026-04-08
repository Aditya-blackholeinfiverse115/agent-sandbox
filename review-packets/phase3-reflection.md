# Phase 3 Reflection

---

## What changed from Phase 2?

Phase 2 produced a structurally correct ActionProposal — the right fields, no decision logic, clean boundary. But it was opaque on failure. When something went wrong, the output was `lifecycle_valid: false` and `governance_request: null`. That was correct but silent. A downstream system receiving that proposal had no way to know whether the chain was empty, whether an agent was suspended, whether the registry failed to resolve, or whether two agents were in a forbidden order. It just knew something failed.

Phase 3 made every failure explicit and structured:

- `failure.stage` — where in the pipeline it stopped
- `failure.codes[]` — what specifically went wrong, as stable machine-readable identifiers
- `failure.message` — human-readable summary of all errors joined together

Three new failure stages were defined and enforced: `EMPTY_CHAIN`, `REGISTRY_RESOLUTION`, `STRUCTURAL_VALIDATION`. Each maps to a distinct point in the pipeline. Each is deterministic — same input produces the same failure every time.

`validateActionProposal` was also upgraded from returning a boolean to returning `{ valid, errors }` where every error is `{ code, field, message }`. The contract is now self-describing. A downstream system does not need to guess what went wrong — it reads the error array.

Chayan was upgraded in parallel — `selection_metadata` was added to the output, making `fallback_used`, `source`, and `confidence` explicit. The unknown task case went from silently returning `agents: []` to explicitly flagging `fallback_used: true`.

---

## What risks were removed?

**Silent empty chain forwarding.**
Before Phase 4, `agents = []` passed structural validation and reached governance with an empty `resource` array. Mandala would have received a governance request for nothing. That is now blocked at the earliest possible gate with `EMPTY_CHAIN`.

**Ambiguous failure identity.**
Before Phase 3, all structural failures looked identical to a downstream consumer — `lifecycle_valid: false`, `governance_request: null`. There was no way to distinguish a suspended agent from a duplicate from a forbidden chain order from a registry miss. A consumer would have to re-run validation itself to find out. That risk is gone — `failure.codes[]` carries all error codes, in deterministic order.

**Schema drift.**
Before Phase 2, `validateActionProposal` returned a boolean. A proposal missing `proposal_id` or carrying `approved` would return `false` but give no indication of which field was wrong or why. A developer adding a new field would not know they had broken the contract. Now every violation produces a named error with a field path. Schema drift is caught and named at runtime.

**Non-reproducible proposals.**
Before Phase 1, `proposal_id` did not exist. Two identical intents produced structurally identical proposals with no way to distinguish them in a log or audit trail. Now every proposal carries a deterministic `proposal_id` derived from its input — same input, same ID, every time. Replay is provable.

**Timestamp contaminating determinism.**
`new Date().toISOString()` inside the proposal builder meant two runs of the same intent would produce different serialised output. The `_timestamp` injection point isolates the live clock from the determinism logic. Tests inject a fixed value. Production callers get a live timestamp. The hash and all structural fields are unaffected either way.

---

## What would break without this layer?

**Mandala / RAJYA would receive unidentifiable proposals.**
Without `proposal_id`, `timestamp`, and `contract_version`, every proposal looks the same in a log. There is no audit trail. There is no way to correlate a governance decision back to the proposal that triggered it. Debugging a production failure becomes impossible.

**Mandala would not know why a chain failed.**
Without `failure { stage, codes[], message }`, a downstream system receiving `lifecycle_valid: false` has two options — reject blindly or re-run the validation itself. Neither is acceptable in a production pipeline. RAJYA needs to know whether to retry, escalate, or surface an error to the operator. Without the failure object, it cannot make that distinction.

**Empty chains would reach governance.**
Without the `EMPTY_CHAIN` gate, an unknown task with no fallback configured would produce a governance request with `resource: []`. Mandala would evaluate a request to execute nothing. Sarathi would enforce a decision on an empty chain. The entire downstream pipeline would process a no-op as if it were a real request.

**Contract violations would be invisible.**
Without `validateActionProposal` returning structured errors, a proposal carrying `approved: true` or an unknown field would fail validation silently. The consuming system would get `false` and have no path to diagnosis. With structured errors, the exact field, the exact violation code, and the exact message are all present. A developer, a log aggregator, or an automated monitor can act on them immediately.

**Replay would be unprovable.**
Without the determinism guarantees — deterministic `proposal_id`, isolated `timestamp`, stable `contract_version` — there is no way to prove that the same intent produces the same proposal. The 45 tests, and specifically the 9 replay tests running 20 iterations each, exist because determinism must be proven by execution, not assumed by inspection.
