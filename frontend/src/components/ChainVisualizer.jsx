import React from "react";

const ChainVisualizer = ({ selectedAgents }) => {
  if (selectedAgents.length === 0) {
    return <p>No agents selected.</p>;
  }

  return (
    <div className="chain">
      {selectedAgents.map((agent, index) => (
        <span key={agent.id}>
          {agent.name}
          {index !== selectedAgents.length - 1 && " → "}
        </span>
      ))}
    </div>
  );
};

export default ChainVisualizer;