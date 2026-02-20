import React from "react";

const AgentCard = ({ agent, isSelected, onToggle }) => {
  const isDisabled = agent.status === "Disabled";

  const handleClick = () => {
    if (!isDisabled) {
      onToggle(agent);
    }
  };

  return (
    <div
      className={`card ${isSelected ? "selected" : ""} ${
        isDisabled ? "disabled" : ""
      }`}
      onClick={handleClick}
    >
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>

      <p className="authority">
        <strong>Authority:</strong> {agent.authority_scope}
      </p>

      <div className="meta">
        <span className={`status ${agent.status.toLowerCase()}`}>
          {agent.status}
        </span>
        <span className="load">Load: {agent.load}%</span>
      </div>

      {isDisabled && (
        <div className="refusal">
          ⚠ {agent.refusal_reason}
        </div>
      )}
    </div>
  );
};

export default AgentCard;