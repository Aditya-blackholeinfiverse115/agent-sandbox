/**
 * AgentContract.js
 *
 * Defines the formal Layer-2 Agent Definition Contract.
 * This enforces structural integrity and deep immutability
 * for all registered agents.
 *
 * Layer-2 defines capability — not runtime behavior.
 */

/**
 * Deep freeze utility.
 * Recursively freezes all nested objects to prevent mutation.
 */
function deepFreeze(obj) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);

    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const value = obj[prop];
      if (value && typeof value === "object") {
        deepFreeze(value);
      }
    });
  }

  return obj;
}

export const LIFECYCLE_STATES = deepFreeze({
  ACTIVE: "Active",
  DEPRECATED: "Deprecated",
  SUSPENDED: "Suspended",
});

/**
 * Factory to create a deterministic, deeply immutable Agent definition.
 * All fields are recursively frozen to prevent runtime mutation.
 */
export function createAgentContract({
  id,
  name,
  description,
  authority_scope,
  capability_type,
  lifecycle_state,
  load_visibility,
  governance_eligible = true,
  why_exists,
}) {
  // Basic structural validation
  if (
    !id ||
    !name ||
    !description ||
    !authority_scope ||
    !capability_type ||
    !lifecycle_state ||
    load_visibility === undefined ||
    !why_exists
  ) {
    throw new Error("AgentContract: Missing required fields.");
  }

  if (!Object.values(LIFECYCLE_STATES).includes(lifecycle_state)) {
    throw new Error("AgentContract: Invalid lifecycle_state.");
  }

  const agent = {
    id,
    name,
    description,
    authority_scope,
    capability_type,
    lifecycle_state,
    load_visibility,
    governance_eligible,
    why_exists,
  };

  // Deep immutability enforcement
  return deepFreeze(agent);
}