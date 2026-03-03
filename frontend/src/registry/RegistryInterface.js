// registry/RegistryInterface.js

import { AgentRegistry } from "./AgentRegistry";

const REGISTRY_VERSION = "1.0.0";

/**
 * Returns all registered agents.
 * Read-only access surface.
 * No mutation allowed.
 */
export function getAllAgents() {
  return AgentRegistry;
}

/**
 * Returns a single agent by id.
 * Ensures strict equality check.
 */
export function getAgentById(id) {
  return AgentRegistry.find((agent) => agent.id === id) || null;
}

/**
 * Returns current registry contract version.
 * Used for integration validation.
 */
export function getRegistryVersion() {
  return REGISTRY_VERSION;
}