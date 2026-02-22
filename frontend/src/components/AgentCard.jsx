import React, { useState } from "react";

const AgentCard = ({ agent, isSelected, onToggle, isRefused }) => {
  const isDisabled = agent.status === "Disabled";
  const [showWhy, setShowWhy] = useState(false);

  const handleClick = () => {
    if (!isDisabled && !isRefused) {
      onToggle(agent);
    }
  };

  const toggleWhy = (e) => {
    e.stopPropagation(); // Prevent selecting agent when clicking transparency
    setShowWhy(!showWhy);
  };

  return (
    <div
      className={`card ${isSelected ? "selected" : ""} 
      ${isDisabled ? "disabled" : ""} 
      ${isRefused ? "governance-refused" : ""}`}
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

      {/* Transparency Toggle */}
      <div className="why-toggle" onClick={toggleWhy}>
        {showWhy ? "▲ Hide explanation" : "▼ Why this agent exists"}
      </div>

      {showWhy && (
        <div className="why-section">
          {agent.why_exists}
        </div>
      )}

      {isDisabled && (
        <div className="refusal">
          ⚠ {agent.refusal_reason}
        </div>
      )}

      {isRefused && (
        <div className="governance-refusal">
          🚫 Governance Refused<br />
          Not eligible in current context
        </div>
      )}
    </div>
  );
};

export default AgentCard;