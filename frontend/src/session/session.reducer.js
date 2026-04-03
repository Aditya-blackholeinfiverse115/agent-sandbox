/**
 * session.reducer.js
 *
 * Runtime Session State
 * --------------------------------
 * Holds mutable runtime state only.
 * Never stores registry agent objects.
 * Stores IDs + runtime flags only.
 */

export const initialSessionState = {
  // Selection Layer
  selectedAgentIds: [],

  // Runtime Layer (simple id -> load mapping)
  runtimeLoadById: {
    1: 12,
    2: 34,
    3: 5,
    4: 0,
    5: 18,
    6: 22,
  },

  // Governance Layer
  governanceOverrides: {},
};

export function sessionReducer(state, action) {
  switch (action.type) {

    /* --------------------------
       Selection Layer
    -------------------------- */

    case "SELECT_AGENT": {
      const id = action.payload;

      if (state.selectedAgentIds.includes(id)) {
        return state;
      }

      return {
        ...state,
        selectedAgentIds: [...state.selectedAgentIds, id],
      };
    }

    case "DESELECT_AGENT": {
      const id = action.payload;

      return {
        ...state,
        selectedAgentIds: state.selectedAgentIds.filter(
          (agentId) => agentId !== id
        ),
      };
    }

    case "REORDER_AGENTS": {
      const newOrder = action.payload;

      // 🔒 Deterministic safety:
      // Only allow reordering of currently selected IDs
      const isValid =
        Array.isArray(newOrder) &&
        newOrder.length === state.selectedAgentIds.length &&
        newOrder.every((id) =>
          state.selectedAgentIds.includes(id)
        );

      if (!isValid) {
        return state;
      }

      return {
        ...state,
        selectedAgentIds: newOrder,
      };
    }

    /* --------------------------
       Runtime Layer
    -------------------------- */

    case "SET_RUNTIME_LOAD": {
      const { id, load } = action.payload;

      return {
        ...state,
        runtimeLoadById: {
          ...state.runtimeLoadById,
          [id]: load,
        },
      };
    }

    /* --------------------------
       Governance Layer
    -------------------------- */

    case "TOGGLE_GOVERNANCE_OVERRIDE": {
      const id = action.payload;

      return {
        ...state,
        governanceOverrides: {
          ...state.governanceOverrides,
          [id]: !state.governanceOverrides[id],
        },
      };
    }

    case "CLEAR_SESSION": {
      return initialSessionState;
    }

    default:
      return state;
  }
}