/*
 * RegistryMeta
 *
 * Defines Layer-2 structural metadata.
 * This file owns configuration — not presentation.
 * No UI component should define these values.
*/

export const registryVersion = "v1.1";
export const contractVersion = "1.0.0";

/*
 * Global mutation policy for registry surface.
 * Layer-2 must remain immutable by default.
*/
export const mutationEnabled = false;

/*
 * Governance model declaration.
 * Defines how agent eligibility is evaluated.
*/
export const governanceModel =
  "Contract-Level Eligibility (Deterministic)";


/* 
  * System context description.
  * Provides a high-level overview of the registry's operational semantics.
  * This is a static description and should not reference dynamic state.
*/
export const systemContextDescription =
  "Agents are immutable capability definitions. Selection does not modify registry state.";