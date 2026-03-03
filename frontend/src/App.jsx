import React from "react";
import {
  getAllAgents,
  getAgentById,
  getRegistryVersion,
  getContractVersion,
  isMutationEnabled,
  getGovernanceModel,
  getSystemContextDescription,
} from "./registry/RegistryInterface";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import { useSession } from "./session/useSession";
import SystemContextBanner from "./components/SystemContextBanner";
import MutationSimulator from "./components/MutationSimulator";
import "./App.css";

function App() {
  // Layer-3: Session Runtime Surface
  const {
    selectedAgentIds = [],
    runtimeLoadById = {},
    selectAgent,
    deselectAgent,
    reorderAgents,
  } = useSession();

  // Controlled registry access (Layer-2 surface)
  const visibleAgents = getAllAgents();

  /**
   * Preserve selection order based on selectedAgentIds
   * (DO NOT use filter alone — breaks reorder determinism)
   */
  const selectedAgents = selectedAgentIds
    .map((id) => getAgentById(id))
    .filter(Boolean);

  return (
    <div className="container">
      <h1>🧠 Deterministic Agent Registry</h1>

      <SystemContextBanner
        registryVersion={getRegistryVersion()}
        contractVersion={getContractVersion()}
        mutationEnabled={isMutationEnabled()}
        governanceModel={getGovernanceModel()}
        systemContextDescription={getSystemContextDescription()}
      />

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

      <MutationSimulator />
    </div>
  );
}

export default App;