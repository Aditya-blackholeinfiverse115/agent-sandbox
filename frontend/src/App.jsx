import React from "react";
import { AgentRegistry } from "./registry/AgentRegistry";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import { useSession } from "./session/useSession";
import SystemContextBanner from "./components/SystemContextBanner";
import "./App.css";

function App() {
  // Layer-3: Session Runtime Surface
  const {
    selectedAgentIds = [],
    runtimeLoadById = {},
    selectAgent,
    deselectAgent,
    reorderAgents, // ✅ needed for drag reorder
  } = useSession();

  /**
   * Preserve selection order based on selectedAgentIds
   * (DO NOT use filter alone — breaks reorder)
   */
  const selectedAgents = selectedAgentIds
    .map((id) =>
      AgentRegistry.find((agent) => agent.id === id)
    )
    .filter(Boolean);

  const visibleAgents = AgentRegistry;

  return (
    <div className="container">
      <h1>🧠 Deterministic Agent Registry</h1>

      <SystemContextBanner
        registryVersion="v1.0"
        mutationEnabled={true}
      />

      <div className="system-banner">
        <strong>System Context:</strong> Agents are immutable capability
        definitions. Selection does not modify registry state.
      </div>

      <h2>Agent Registry</h2>
      <AgentList
        agents={visibleAgents}
        selectedAgentIds={selectedAgentIds}
        selectAgent={selectAgent}
        deselectAgent={deselectAgent}
        runtimeLoadById={runtimeLoadById}
      />

      <SelectionBucket
        selectedAgents={selectedAgents}
        deselectAgent={deselectAgent}
        reorderAgents={reorderAgents}
      />

      <h2>Chain Visualization</h2>
      <ChainVisualizer selectedAgents={selectedAgents} />

      <h2>Chain Preview</h2>
      <ChainPreview selectedAgents={selectedAgents} />
    </div>
  );
}

export default App;