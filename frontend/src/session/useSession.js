/**
 * useSession.js
 *
 * Public interface to Session Layer.
 * Components interact with session only through this hook.
 * Registry is NOT accessible here.
 */

import { useReducer } from "react";
import {
  sessionReducer,
  initialSessionState,
} from "./session.reducer";

export function useSession() {
  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionState
  );

  /* --------------------------
     Action Wrappers
  -------------------------- */

  const selectAgent = (id) =>
    dispatch({ type: "SELECT_AGENT", payload: id });

  const deselectAgent = (id) =>
    dispatch({ type: "DESELECT_AGENT", payload: id });

  const reorderAgents = (newOrderedIds) =>
    dispatch({
      type: "REORDER_AGENTS",
      payload: newOrderedIds,
    });

  /* --------------------------
     Public Session Surface
  -------------------------- */

  return {
    // Selection Layer
    selectedAgentIds: state.selectedAgentIds,

    // Runtime Layer
    runtimeLoadById: state.runtimeLoadById,

    // Governance Layer
    governanceOverrides: state.governanceOverrides,

    // Actions
    selectAgent,
    deselectAgent,
    reorderAgents,
  };
}
