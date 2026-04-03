import { validateStructure } from "./StructuralValidator";

/**
 * Deterministic Layer-2 ActionProposal Builder
 * NON-NEGOTIABLE CONTRACT
 */

export function buildActionProposal({
  actor,
  action,
  agents,
  context = {}
}) {

  // Step 1 — Structural validation
  const validation = validateStructure(agents);

  // Step 2 — If invalid → reject immediately
  if (!validation.valid) {
    return {
      approved: false,

      actor,

      action,

      agents,

      sequence: [...agents],

      constraints: {
        lifecycle_valid: false,
        governance_status: "deny"
      },

      context: {},

      reason: validation.errors.join(", ")
    };
  }

  // Step 3 — Valid → allow execution
  return {
    approved: true,

    actor,

    action,

    agents: [...agents],

    sequence: [...agents],

    constraints: {
      lifecycle_valid: true,
      governance_status: "allow"
    },

    context,

    reason:
      "Deterministic Layer-2 approval: lifecycle valid and governance allow"
  };
}