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

function buildFailure(stage, codes, message) {
  return { stage, codes, message };
}

export function buildActionProposal({ actor, action, agents, context = {}, _timestamp } = {}) {
  const proposal_id = generateProposalId({ actor, action, agents, context });
  const timestamp   = _timestamp ?? new Date().toISOString();

  const base = {
    proposal_id,
    timestamp,
    contract_version: CONTRACT_VERSION,
    actor,
    action,
    agents,
    sequence: [...agents],
    context,
  };

  const resolved = agents.map((id) => RegistryInterface.getAgentById(id));

  if (agents.length === 0) {
    return {
      ...base,
      constraints: { lifecycle_valid: false },
      failure: buildFailure(
        "EMPTY_CHAIN",
        ["EMPTY_AGENT_CHAIN"],
        "No agents provided — an empty chain cannot be executed"
      ),
      governance_request: null,
    };
  }

  if (resolved.includes(null)) {
    return {
      ...base,
      constraints: { lifecycle_valid: false },
      failure: buildFailure(
        "REGISTRY_RESOLUTION",
        ["AGENT_NOT_FOUND"],
        "One or more agent IDs could not be resolved in the registry"
      ),
      governance_request: null,
    };
  }

  const validation = validateStructure(resolved);

  if (!validation.valid) {
    const codes = validation.errors.map((e) => e.code);
    const message = validation.errors.map((e) => e.message).join("; ");
    return {
      ...base,
      constraints: { lifecycle_valid: false },
      failure: buildFailure("STRUCTURAL_VALIDATION", codes, message),
      governance_request: null,
    };
  }

  return {
    ...base,
    constraints: { lifecycle_valid: true },
    failure: null,
    governance_request: buildGovernanceRequest({ actor, action, resource: agents, context }),
  };
}
