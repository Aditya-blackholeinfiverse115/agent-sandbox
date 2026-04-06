const FORBIDDEN_CHAINS = [
  [3, 1], // Risk Evaluator cannot directly precede Text Summarizer
  [6, 2], // Workflow Router cannot directly precede Data Formatter
];

export const ERROR_CODES = {
  AGENT_SUSPENDED: "AGENT_SUSPENDED",
  DUPLICATE_AGENTS: "DUPLICATE_AGENTS",
  INVALID_CHAIN:    "INVALID_CHAIN",
};

export function validateStructure(resolvedAgents = []) {
  const errors = [];

  // 1. Lifecycle — in chain order
  for (const agent of resolvedAgents) {
    if (agent.lifecycle_state === "Suspended") {
      errors.push({
        code: ERROR_CODES.AGENT_SUSPENDED,
        message: `Suspended agent detected: ${agent.id}`,
      });
    }
  }

  // 2. Duplicates
  const ids = resolvedAgents.map((a) => a.id);
  if (new Set(ids).size !== ids.length) {
    errors.push({
      code: ERROR_CODES.DUPLICATE_AGENTS,
      message: "Duplicate agents detected",
    });
  }

  // 3. Ordering constraints — in chain order
  for (let i = 0; i < resolvedAgents.length - 1; i++) {
    for (const [from, to] of FORBIDDEN_CHAINS) {
      if (resolvedAgents[i].id === from && resolvedAgents[i + 1].id === to) {
        errors.push({
          code: ERROR_CODES.INVALID_CHAIN,
          message: `Invalid chaining: ${resolvedAgents[i].name} cannot precede ${resolvedAgents[i + 1].name}`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
