import React from "react";
import AgentCard from "./AgentCard";
import { LIFECYCLE_STATES } from "../registry/AgentContract";

const AgentList = ({
  agents,
  selectedAgentIds,
  selectAgent,
  deselectAgent,
  runtimeLoadById,
}) => {

  // Deterministic lifecycle enforcement ONLY
  const toggleAgent = (agent) => {
    const lifecycle =
      agent.lifecycle_state || LIFECYCLE_STATES.ACTIVE;

    const isSuspended =
      lifecycle === LIFECYCLE_STATES.SUSPENDED;

    const isGovernanceEligible =
      agent.governance_eligible;

    // 🔒 Central enforcement rule
    if (isSuspended || !isGovernanceEligible) return;

    if (selectedAgentIds.includes(agent.id)) {
      deselectAgent(agent.id);
    } else {
      selectAgent(agent.id);
    }
  };

  return (
    <div className="grid">
      {agents.map((agent) => {
        const isSelected =
          selectedAgentIds.includes(agent.id);

        const load =
          runtimeLoadById?.[agent.id] ?? 0;

        return (
          <AgentCard
            key={agent.id}
            agent={agent}
            load={load}
            isSelected={isSelected}
            onToggle={() => toggleAgent(agent)}
          />
        );
      })}
    </div>
  );
};

export default AgentList;