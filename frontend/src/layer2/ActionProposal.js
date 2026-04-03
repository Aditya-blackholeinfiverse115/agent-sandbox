// src/layer2/ActionProposal.js

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
  return {
    approved: true,

    actor: actor,

    action: action,

    agents: [...agents],

    sequence: [...agents],

    constraints: {
      lifecycle_valid: true,
      governance_status: "allow"
    },

    context: context,

    reason:
      "Deterministic Layer-2 approval: lifecycle valid and governance allow"
  };
}