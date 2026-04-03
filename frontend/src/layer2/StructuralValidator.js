export function validateStructure(agents = []) {
  const errors = [];

  // Rule 1: no suspended agents
  const suspendedAgents = ["suspended.agent"]; // deterministic list

  agents.forEach(agent => {
    if (suspendedAgents.includes(agent)) {
      errors.push(`Suspended agent detected: ${agent}`);
    }
  });

  // Rule 2: no duplicates
  const unique = new Set(agents);
  if (unique.size !== agents.length) {
    errors.push("Duplicate agents detected");
  }

  // Rule 3: invalid chaining rule #1
  for (let i = 0; i < agents.length - 1; i++) {
    if (
      agents[i] === "executor.agent" &&
      agents[i + 1] === "planner.agent"
    ) {
      errors.push(
        "Invalid chaining: executor.agent cannot precede planner.agent"
      );
    }
  }

  // Rule 4: invalid chaining rule #2
  for (let i = 0; i < agents.length - 1; i++) {
    if (
      agents[i] === "system.agent" &&
      agents[i + 1] === "user.agent"
    ) {
      errors.push(
        "Invalid chaining: system.agent cannot precede user.agent"
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}