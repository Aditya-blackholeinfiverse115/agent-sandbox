import React, { useState } from "react";
import { getAllAgents } from "../registry/RegistryInterface";

export default function MutationSimulator() {
  const [logs, setLogs] = useState([]);

  const agents = getAllAgents();
  const targetAgent = agents[0]; // deterministic selection

  const logResult = (message) => {
    console.log(message);
    setLogs((prev) => [...prev, message]);
  };

  const attemptAuthorityMutation = () => {
    try {
      targetAgent.authority_scope = "ROOT_OVERRIDE";
      logResult("❌ Authority mutation unexpectedly succeeded.");
    } catch {
      logResult("✅ Authority mutation blocked (immutable).");
    }
  };

  const attemptLifecycleMutation = () => {
    try {
      targetAgent.lifecycle_state = "DEPRECATED";
      logResult("❌ Lifecycle mutation unexpectedly succeeded.");
    } catch {
      logResult("✅ Lifecycle mutation blocked (immutable).");
    }
  };

  const attemptGovernanceMutation = () => {
    try {
      targetAgent.governance_eligible = false;
      logResult("❌ Governance mutation unexpectedly succeeded.");
    } catch {
      logResult("✅ Governance mutation blocked (immutable).");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #1e293b",
        padding: "16px",
        borderRadius: "8px",
        marginTop: "20px",
        marginBottom: "20px",
        backgroundColor: "#0f172a",
      }}
    >
      <h3 style={{ color: "#ffffff" , marginBottom: "10px"}}>
        🔴 Debug Mode – Not Production Surface
      </h3>

      <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
        <button style={{padding: "6px",color: "#ffffff",background: "#1e293b", borderRadius: "8px", cursor: "pointer"}} onClick={attemptAuthorityMutation}>
          Attempt to mutate authority
        </button>

        <button style={{padding: "6px",color: "#ffffff",background: "#1e293b", borderRadius: "8px", cursor: "pointer"}} onClick={attemptLifecycleMutation}>
          Attempt to mutate lifecycle
        </button>

        <button style={{padding: "6px",color: "#ffffff",background: "#1e293b", borderRadius: "8px", cursor: "pointer"}} onClick={attemptGovernanceMutation}>
          Attempt to mutate governance eligibility
        </button>
      </div>

      <div
        style={{
          background: "#111",
          padding: "10px",
          fontSize: "14px",
          minHeight: "80px",
          border: "1px solid #333",
        }}
      >
        {logs.length === 0 && <div>No mutation attempts yet.</div>}

        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}