export function simulateGovernance({ actor, action, resource, context }) {

  const request = {
    actor,
    action,
    resource,
    context
  };

  // deterministic rules
  let response = "deny"; //  fail-closed default

  // Rule 1 — weather allowed
  if (action === "weather.fetch") {
    response = "allow";
  }

  // Rule 2 — multi-agent escalation
  if (resource.length > 1) {
    response = "escalate";
  }

  // Rule 3 — system actor deny
  if (actor === "system") {
    response = "deny";
  }

  return {
    request,
    response
  };
}