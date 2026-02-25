import React, { useState } from "react";
import { LIFECYCLE_STATES } from "../registry/AgentContract";

const AgentCard = ({
  agent,
  isSelected,
  onToggle,
  isRefused,
  load,
}) => {
  const lifecycle = agent.lifecycle_state;

  // -----------------------------
  // Deterministic Lifecycle Rules
  // -----------------------------

  const isSuspended =
    lifecycle === LIFECYCLE_STATES.SUSPENDED;

  const isDeprecated =
    lifecycle === LIFECYCLE_STATES.DEPRECATED;

  const isActive =
    lifecycle === LIFECYCLE_STATES.ACTIVE;

  // Suspended = visible but not selectable
  const isDisabled = isSuspended;

  const [showWhy, setShowWhy] = useState(false);

  const handleClick = () => {
    if (isDisabled || isRefused) return;
    onToggle();
  };

  const toggleWhy = (e) => {
    e.stopPropagation();
    setShowWhy(!showWhy);
  };

  return (
    <div
      className={`card
        ${isSelected ? "selected" : ""}
        ${isDisabled ? "disabled" : ""}
        ${isDeprecated ? "deprecated" : ""}
        ${isRefused ? "governance-refused" : ""}
      `}
      onClick={handleClick}
    >
      <h3>
        {agent.name}
        {isDeprecated && (
          <span className="badge-warning">
            ⚠ Deprecated
          </span>
        )}
      </h3>

      <p>{agent.description}</p>

      <p className="authority">
        <strong>Authority:</strong> {agent.authority_scope}
      </p>

      <div className="meta">
        <span
          className={`lifecycle_state ${lifecycle.toLowerCase()}`}
        >
          {lifecycle}
        </span>

        <span className="load">
          Load: {load ?? 0}%
        </span>
      </div>

      <div className="why-toggle" onClick={toggleWhy}>
        {showWhy
          ? "▲ Hide explanation"
          : "▼ Why this agent exists"}
      </div>

      {showWhy && (
        <div className="why-section">
          {agent.why_exists}
        </div>
      )}

      {isSuspended && (
        <div className="refusal">
          ⚠ Agent Suspended — Not Selectable
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