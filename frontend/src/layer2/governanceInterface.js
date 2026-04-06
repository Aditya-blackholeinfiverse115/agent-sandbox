/**
 * governanceInterface.js
 *
 * External governance hook — stub only.
 * Accepts a governance request and returns a placeholder response.
 * No rules, no decisions, no simulation.
 *
 * Integration target: replace with live governance engine when available.
 */

export function submitGovernanceRequest(request) {
  return {
    received: true,
    request,
    response: null,
  };
}
