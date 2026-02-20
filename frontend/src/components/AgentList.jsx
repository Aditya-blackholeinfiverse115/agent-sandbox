import React from "react";
import AgentCard from "./AgentCard";

const AgentList = ({ agents, selectedAgents, setSelectedAgents }) => {
  const toggleAgent = (agent) => {
    const exists = selectedAgents.find((a) => a.id === agent.id);

    if (exists) {
      setSelectedAgents(
        selectedAgents.filter((a) => a.id !== agent.id)
      );
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  return (
    <div className="grid">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isSelected={selectedAgents.some((a) => a.id === agent.id)}
          onToggle={toggleAgent}
        />
      ))}
    </div>
  );
};

export default AgentList;