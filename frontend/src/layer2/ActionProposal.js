import { validateStructure } from "./StructuralValidator";
import { simulateGovernance } from "./GovernanceHandshake";

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

  // Step 2 — Governance handshake (Sarathi simulation)
  const governance = simulateGovernance({
    actor,
    action,
    resource: agents,
    context
  });

  // display required logs
  console.log("Governance Request:", governance.request);
  console.log("Governance Response:", governance.response);

  // decision impact
  const approved = governance.response === "allow";

  // Step 3 — Final deterministic output
  return {
    approved,

    actor,

    action,

    agents: [...agents],

    sequence: [...agents],

    constraints: {
      lifecycle_valid: true,
      governance_status: governance.response
    },

    context,

    reason: `Governance decision: ${governance.response}`
  };
}