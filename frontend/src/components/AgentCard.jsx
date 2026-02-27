import React, { useState } from "react";
import { LIFECYCLE_STATES } from "../registry/AgentContract";

const AgentCard = ({
  agent,
  isSelected,
  onToggle,
  load,
}) => {
  const lifecycle =
    agent.lifecycle_state || LIFECYCLE_STATES.ACTIVE;

  // --------------------------------
  // Deterministic Contract Enforcement
  // --------------------------------

  const isSuspended =
    lifecycle === LIFECYCLE_STATES.SUSPENDED;

  const isDeprecated =
    lifecycle === LIFECYCLE_STATES.DEPRECATED;

  const isGovernanceEligible =
    agent.governance_eligible;

  // Unified enforcement rule
  const isDisabled =
    isSuspended || !isGovernanceEligible;

  const [showWhy, setShowWhy] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;
    onToggle();
  };

  const toggleWhy = (e) => {
    e.stopPropagation();
    setShowWhy((prev) => !prev);
  };

  return (
    <div
      className={[
        "card",
        isSelected && "selected",
        isDisabled && "disabled",
        isDeprecated && "deprecated",
        !isGovernanceEligible && "governance-refused",
      ]
        .filter(Boolean)
        .join(" ")}
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

        <span className="load">{agent.load_visibility
          ? `Load: ${load ?? 0}%`
          : "Load: Hidden"}
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

      {!isGovernanceEligible && (
        <div className="governance-refusal">
          🚫 Governance Refused
          <br />
          Not eligible under current contract
        </div>
      )}
    </div>
  );
};

export default AgentCard;