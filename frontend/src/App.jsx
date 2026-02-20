import { useState } from "react";
import { mockAgents } from "./data/mockAgents";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import "./App.css";

function App() {
  const [selectedAgents, setSelectedAgents] = useState([]);

  return (
    <div className="container">
      <h1>🧠 Agent Sandbox UI</h1>

      <h2>Agent Registry</h2>
      <AgentList
        agents={mockAgents}
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
      />

      <h2>Chain Visualization</h2>
      <ChainVisualizer selectedAgents={selectedAgents} />
    </div>
  );
}

export default App;