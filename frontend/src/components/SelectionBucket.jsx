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

/* =========================
   Sortable Item
========================= */
const SortableItem = ({ agent, onRemove }) => {
  const isLocked = !agent.governance_eligible;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: agent.id,
    disabled: isLocked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bucket-item ${isLocked ? "locked" : ""}`}
      {...attributes}
    >
      <div
        {...(!isLocked ? listeners : {})}
        className="drag-handle"
        style={{
          cursor: isLocked ? "not-allowed" : "grab",
          marginRight: "10px",
          opacity: isLocked ? 0.4 : 1,
        }}
      >
        ☰
      </div>

      <div style={{ flex: 1 }}>
        <strong>{agent.name}</strong>
        <p className="bucket-desc">{agent.description}</p>

        {isLocked && (
          <div className="governance-refusal">
            🚫 Contract Ineligible
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={isLocked}
        onClick={() => !isLocked && onRemove(agent.id)}
        style={{
          opacity: isLocked ? 0.5 : 1,
          cursor: isLocked ? "not-allowed" : "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
};

/* =========================
   Selection Bucket
========================= */
const SelectionBucket = ({
  selectedAgents,
  deselectAgent,
  reorderAgents,
}) => {

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedAgents.findIndex(
      (a) => a.id === active.id
    );
    const newIndex = selectedAgents.findIndex(
      (a) => a.id === over.id
    );

    const reordered = arrayMove(
      selectedAgents,
      oldIndex,
      newIndex
    ).map((a) => a.id);

    reorderAgents(reordered);
  };

  return (
    <div className="bucket">
      <h2>🪣 Agent Selection Bucket</h2>

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
                onRemove={deselectAgent}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default SelectionBucket;