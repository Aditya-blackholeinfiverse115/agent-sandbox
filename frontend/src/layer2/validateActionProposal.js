const REQUIRED_FIELDS = [
  "proposal_id",
  "timestamp",
  "contract_version",
  "actor",
  "action",
  "agents",
  "sequence",
  "constraints",
  "context",
  "governance_request",
];

const FORBIDDEN_FIELDS = ["approved", "reason"];

const GOVERNANCE_REQUEST_REQUIRED = ["actor", "action", "resource", "context"];
const GOVERNANCE_REQUEST_FORBIDDEN = ["response"];

function err(code, field, message) {
  return { code, field, message };
}

export function validateActionProposal(proposal) {
  const errors = [];

  // 1. Required fields must exist
  for (const field of REQUIRED_FIELDS) {
    if (!(field in proposal)) {
      errors.push(err("MISSING_FIELD", field, `Required field "${field}" is missing`));
    }
  }

  // 2. Forbidden fields must not exist
  for (const field of FORBIDDEN_FIELDS) {
    if (field in proposal) {
      errors.push(err("FORBIDDEN_FIELD", field, `Field "${field}" is not permitted — no decision fields allowed`));
    }
  }

  // 3. No unknown fields
  const knownFields = new Set([...REQUIRED_FIELDS, ...FORBIDDEN_FIELDS]);
  for (const field of Object.keys(proposal)) {
    if (!knownFields.has(field)) {
      errors.push(err("UNKNOWN_FIELD", field, `Unknown field "${field}" is not part of the contract`));
    }
  }

  // 4. Strict type checks — only if field is present
  if ("proposal_id" in proposal && typeof proposal.proposal_id !== "string")
    errors.push(err("INVALID_TYPE", "proposal_id", "Must be a string"));

  if ("timestamp" in proposal && typeof proposal.timestamp !== "string")
    errors.push(err("INVALID_TYPE", "timestamp", "Must be a string"));

  if ("contract_version" in proposal && typeof proposal.contract_version !== "string")
    errors.push(err("INVALID_TYPE", "contract_version", "Must be a string"));

  if ("actor" in proposal && typeof proposal.actor !== "string")
    errors.push(err("INVALID_TYPE", "actor", "Must be a string"));

  if ("action" in proposal && typeof proposal.action !== "string")
    errors.push(err("INVALID_TYPE", "action", "Must be a string"));

  if ("agents" in proposal && !Array.isArray(proposal.agents))
    errors.push(err("INVALID_TYPE", "agents", "Must be an array"));

  if ("sequence" in proposal && !Array.isArray(proposal.sequence))
    errors.push(err("INVALID_TYPE", "sequence", "Must be an array"));

  if ("constraints" in proposal) {
    if (typeof proposal.constraints !== "object" || Array.isArray(proposal.constraints))
      errors.push(err("INVALID_TYPE", "constraints", "Must be an object"));
    else if (typeof proposal.constraints.lifecycle_valid !== "boolean")
      errors.push(err("INVALID_TYPE", "constraints.lifecycle_valid", "Must be a boolean"));
  }

  if ("context" in proposal && (typeof proposal.context !== "object" || Array.isArray(proposal.context)))
    errors.push(err("INVALID_TYPE", "context", "Must be an object"));

  // 5. governance_request — must exist, must be null or valid shape
  if ("governance_request" in proposal) {
    const gr = proposal.governance_request;

    if (gr !== null) {
      if (typeof gr !== "object" || Array.isArray(gr)) {
        errors.push(err("INVALID_GOVERNANCE_REQUEST", "governance_request", "Must be null or an object"));
      } else {
        for (const field of GOVERNANCE_REQUEST_REQUIRED) {
          if (!(field in gr))
            errors.push(err("INVALID_GOVERNANCE_REQUEST", `governance_request.${field}`, `Required field "${field}" missing from governance_request`));
        }

        if ("actor" in gr && typeof gr.actor !== "string")
          errors.push(err("INVALID_GOVERNANCE_REQUEST", "governance_request.actor", "Must be a string"));

        if ("action" in gr && typeof gr.action !== "string")
          errors.push(err("INVALID_GOVERNANCE_REQUEST", "governance_request.action", "Must be a string"));

        if ("resource" in gr && !Array.isArray(gr.resource))
          errors.push(err("INVALID_GOVERNANCE_REQUEST", "governance_request.resource", "Must be an array"));

        if ("context" in gr && (typeof gr.context !== "object" || Array.isArray(gr.context)))
          errors.push(err("INVALID_GOVERNANCE_REQUEST", "governance_request.context", "Must be an object"));

        for (const field of GOVERNANCE_REQUEST_FORBIDDEN) {
          if (field in gr)
            errors.push(err("FORBIDDEN_FIELD", `governance_request.${field}`, `Field "${field}" is not permitted inside governance_request`));
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
