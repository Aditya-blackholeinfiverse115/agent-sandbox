export function validateActionProposal(proposal) {
  if (typeof proposal.actor !== "string") return false;
  if (typeof proposal.action !== "string") return false;
  if (!Array.isArray(proposal.agents)) return false;
  if (!Array.isArray(proposal.sequence)) return false;
  if (typeof proposal.constraints !== "object") return false;
  if (typeof proposal.constraints.lifecycle_valid !== "boolean") return false;
  if (typeof proposal.context !== "object") return false;
  if (typeof proposal.reason !== "string") return false;
  return true;
}
