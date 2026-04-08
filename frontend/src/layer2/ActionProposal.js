import { validateStructure } from "./StructuralValidator";
import { buildGovernanceRequest } from "./GovernanceHandshake";
import { RegistryInterface } from "../registry/RegistryInterface.js";

export const CONTRACT_VERSION = "v1.1";

function generateProposalId({ actor, action, agents, context }) {
  const payload = JSON.stringify({ actor, action, agents, context });
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "ap-" + Math.abs(hash).toString(16);
}

export function buildActionProposal({ actor, action, agents, context = {}, _timestamp } = {}) {
  const proposal_id = generateProposalId({ actor, action, agents, context });
  const timestamp   = _timestamp ?? new Date().toISOString();

  const resolved = agents.map((id) => RegistryInterface.getAgentById(id));
  const structurallyValid = !resolved.includes(null) && validateStructure(resolved).valid;

  if (!structurallyValid) {
    return {
      proposal_id,
      timestamp,
      contract_version: CONTRACT_VERSION,
      actor,
      action,
      agents,
      sequence: [...agents],
      constraints: { lifecycle_valid: false },
      context,
      governance_request: null,
    };
  }

  return {
    proposal_id,
    timestamp,
    contract_version: CONTRACT_VERSION,
    actor,
    action,
    agents,
    sequence: [...agents],
    constraints: { lifecycle_valid: true },
    context,
    governance_request: buildGovernanceRequest({ actor, action, resource: agents, context }),
  };
}
