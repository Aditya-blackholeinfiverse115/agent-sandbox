import { validateStructure } from "./StructuralValidator";
import { simulateGovernance } from "./GovernanceHandshake";
import { RegistryInterface } from "../registry/RegistryInterface.js";

export function buildActionProposal({
  actor,
  action,
  agents,
  context = {}
}) {

  // registry interface usage
  const resolved = agents.map((id) => {
    const agent = RegistryInterface.getAgentById(id);

    return agent || {
      id,
      status: "missing"
    };
  });

  // fail closed
  if (resolved.includes(undefined)) {
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
      context,
      reason: "Agent not found in registry"
    };
  }

  // structural validation
  const validation = validateStructure(agents);

  // governance handshake
  const governance = simulateGovernance({
    actor,
    action,
    resource: agents,
    context
  });

  const approved =
    validation.valid &&
    governance.response === "allow";

  return {
    approved,
    actor,
    action,
    agents,
    sequence: [...agents],
    constraints: {
      lifecycle_valid: validation.valid,
      governance_status: governance.response
    },
    context,
    reason: approved
      ? "Validation passed and governance allowed"
      : "Rejected by Layer-2 decision engine"
  };
}