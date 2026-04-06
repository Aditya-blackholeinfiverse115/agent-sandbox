import { validateStructure } from "./StructuralValidator";
import { buildGovernanceRequest } from "./GovernanceHandshake";
import { RegistryInterface } from "../registry/RegistryInterface.js";

export function buildActionProposal({ actor, action, agents, context = {} }) {
  const resolved = agents.map((id) => RegistryInterface.getAgentById(id));

  if (resolved.includes(null)) {
    return {
      actor,
      action,
      agents,
      sequence: [...agents],
      constraints: { lifecycle_valid: false },
      context,
      reason: "Agent not found in registry",
    };
  }

  const validation = validateStructure(resolved);

  if (!validation.valid) {
    return {
      actor,
      action,
      agents,
      sequence: [...agents],
      constraints: { lifecycle_valid: false },
      context,
      reason: "Rejected by Layer-2 structural validator",
    };
  }

  const governanceRequest = buildGovernanceRequest({ actor, action, resource: agents, context });

  return {
    actor,
    action,
    agents,
    sequence: [...agents],
    constraints: { lifecycle_valid: true },
    governanceRequest,
    context,
    reason: "Structural validation passed — awaiting governance",
  };
}
