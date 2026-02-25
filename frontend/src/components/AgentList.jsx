import React from "react";
import AgentCard from "./AgentCard";
import { LIFECYCLE_STATES } from "../registry/AgentContract";

const AgentList = ({
  agents,
  selectedAgentIds,
  selectAgent,
  deselectAgent,
  simulateRefusal,
  runtimeLoadById,
}) => {

  // Deterministic lifecycle enforcement
  const toggleAgent = (agent) => {
    const isSuspended =
      agent.lifecycle_state === LIFECYCLE_STATES.SUSPENDED;

    const isRefused =
      simulateRefusal && agent.id === 3;

    // Suspended agents cannot be selected
    if (isSuspended || isRefused) return;

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

        const isSuspended =
          agent.lifecycle_state === LIFECYCLE_STATES.SUSPENDED;

        const isDeprecated =
          agent.lifecycle_state === LIFECYCLE_STATES.DEPRECATED;

        const isRefused =
          simulateRefusal && agent.id === 3;

        return (
          <AgentCard
            key={agent.id}
            agent={agent}
            load={load}
            isSelected={isSelected}
            onToggle={() => toggleAgent(agent)}
            isSuspended={isSuspended}
            isDeprecated={isDeprecated}
            isRefused={isRefused}
          />
        );
      })}
    </div>
  );
};

export default AgentList;