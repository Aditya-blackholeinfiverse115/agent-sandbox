// registry/RegistryInterface.js

import { AgentRegistry } from "./AgentRegistry";
import {
  registryVersion,
  contractVersion,
  mutationEnabled,
  governanceModel,
  systemContextDescription,
} from "./RegistryMeta";

/*
 * Returns all registered agents.
 * Read-only access surface.
 * No mutation allowed.
 */
export function getAllAgents() {
  return AgentRegistry;
}

/*
 * Returns a single agent by id.
 * Ensures strict equality check.
 */
export function getAgentById(id) {
  return AgentRegistry.find((agent) => agent.id === id) || null;
}

/*
 * Returns registry structural version.
 * Used for integration validation.
 */
export function getRegistryVersion() {
  return registryVersion;
}

/*
 * Returns contract schema version.
 * Separates registry evolution from contract evolution.
 */
export function getContractVersion() {
  return contractVersion;
}

/*
 * Returns global mutation policy.
 * UI must not hardcode mutation behavior.
 */
export function isMutationEnabled() {
  return mutationEnabled;
}

/*
 * Returns governance model declaration.
 * Keeps governance semantics outside presentation layer.
 */
export function getGovernanceModel() {
  return governanceModel;
}


/*
 * Returns system context description.
 * Provides high-level operational semantics.
 * Should not reference dynamic state or UI concerns.
 */
export function getSystemContextDescription() {
  return systemContextDescription;
}