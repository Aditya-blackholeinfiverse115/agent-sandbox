import { useState } from "react";
import { mockAgents } from "./data/mockAgents";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import "./App.css";

function App() {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [simulateRefusal, setSimulateRefusal] = useState(false);

  return (
    <div className="container">
      <h1>🧠 Agent Sandbox</h1>

      <div className="governance-toggle">
        <label>
          <input
            type="checkbox"
            checked={simulateRefusal}
            onChange={() => setSimulateRefusal(!simulateRefusal)}
          />
          Simulate Governance Refusal
        </label>
      </div>

      <h2>Agent Registry</h2>
      <AgentList
        agents={mockAgents}
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
        simulateRefusal={simulateRefusal}
      />

      <SelectionBucket
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
        isGovernanceRefused={simulateRefusal}
      />

      <h2>Chain Visualization</h2>
      <ChainVisualizer selectedAgents={selectedAgents} />

      <h2>Chain Preview</h2>
      <ChainPreview selectedAgents={selectedAgents} />
    </div>
  );
}

export default App;