import React from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ agent, onRemove, isGovernanceRefused }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: agent.id,
    disabled: isGovernanceRefused, // 🔒 Disable drag when refused
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bucket-item ${isGovernanceRefused ? "locked" : ""}`}
      {...attributes}
    >
      {/* Drag Handle */}
      <div
        {...(!isGovernanceRefused ? listeners : {})}
        className="drag-handle"
        style={{
          cursor: isGovernanceRefused ? "not-allowed" : "grab",
          marginRight: "10px",
          opacity: isGovernanceRefused ? 0.4 : 1,
        }}
      >
        ☰
      </div>

      <div style={{ flex: 1 }}>
        <strong>{agent.name}</strong>
        <p className="bucket-desc">{agent.description}</p>
      </div>

      <button
        onClick={() => !isGovernanceRefused && onRemove(agent.id)}
        type="button"
        disabled={isGovernanceRefused}
        style={{
          opacity: isGovernanceRefused ? 0.5 : 1,
          cursor: isGovernanceRefused ? "not-allowed" : "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
};

const SelectionBucket = ({
  selectedAgents,
  setSelectedAgents,
  isGovernanceRefused, // 🔥 New prop
}) => {

  const handleDragEnd = (event) => {
    if (isGovernanceRefused) return; // 🔒 Block reorder

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = selectedAgents.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = selectedAgents.findIndex(
      (item) => item.id === over.id
    );

    setSelectedAgents((items) =>
      arrayMove(items, oldIndex, newIndex)
    );
  };

  const removeAgent = (id) => {
    if (isGovernanceRefused) return; // 🔒 Block removal

    setSelectedAgents((items) =>
      items.filter((a) => a.id !== id)
    );
  };

  return (
    <div className={`bucket ${isGovernanceRefused ? "bucket-locked" : ""}`}>
      <h2>🪣 Agent Selection Bucket</h2>

      {isGovernanceRefused && (
        <div className="bucket-warning">
          🚫 Governance active — bucket interaction locked
        </div>
      )}

      {selectedAgents.length === 0 ? (
        <p>No agents selected.</p>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedAgents.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            {selectedAgents.map((agent) => (
              <SortableItem
                key={agent.id}
                agent={agent}
                onRemove={removeAgent}
                isGovernanceRefused={isGovernanceRefused}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default SelectionBucket;