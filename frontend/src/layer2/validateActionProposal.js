export function validateActionProposal(proposal) {
  if (typeof proposal.proposal_id !== "string") return false;
  if (typeof proposal.timestamp !== "string") return false;
  if (typeof proposal.contract_version !== "string") return false;
  if (typeof proposal.actor !== "string") return false;
  if (typeof proposal.action !== "string") return false;
  if (!Array.isArray(proposal.agents)) return false;
  if (!Array.isArray(proposal.sequence)) return false;
  if (typeof proposal.constraints !== "object") return false;
  if (typeof proposal.constraints.lifecycle_valid !== "boolean") return false;
  if (typeof proposal.context !== "object") return false;
  if (!("governance_request" in proposal)) return false;

  const gr = proposal.governance_request;
  if (gr !== null) {
    if (typeof gr.actor !== "string") return false;
    if (typeof gr.action !== "string") return false;
    if (!Array.isArray(gr.resource)) return false;
    if (typeof gr.context !== "object") return false;
    if ("response" in gr) return false;
  }

  if ("approved" in proposal) return false;
  if ("reason" in proposal) return false;

  return true;
}
