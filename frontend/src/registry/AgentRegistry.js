import { createAgentContract, LIFECYCLE_STATES } from "./AgentContract";

export const AgentRegistry = Object.freeze([
  createAgentContract({
    id: 1,
    name: "Text Summarizer",
    description: "Condenses long text into concise summaries.",
    authority_scope: "Authorized to process text inputs only.",
    capability_type: "Text Processing",
    lifecycle_state: LIFECYCLE_STATES.ACTIVE,
    load_visibility: true,
    governance_eligible: true,
    why_exists:
      "Reduces cognitive load by transforming long-form text into concise summaries without altering meaning.",
  }),

  createAgentContract({
    id: 2,
    name: "Data Formatter",
    description: "Formats raw data into structured output.",
    authority_scope: "Can restructure data but cannot modify meaning.",
    capability_type: "Data Structuring",
    lifecycle_state: LIFECYCLE_STATES.ACTIVE,
    load_visibility: true,
    governance_eligible: true,
    why_exists:
      "Ensures consistency and structure in raw data without changing semantic meaning.",
  }),

  createAgentContract({
    id: 3,
    name: "Risk Evaluator",
    description: "Evaluates operational and decision risk.",
    authority_scope: "Risk scoring only. No execution authority.",
    capability_type: "Risk Analysis",
    lifecycle_state: LIFECYCLE_STATES.ACTIVE,
    load_visibility: true,
    governance_eligible: true,
    why_exists:
      "Assesses potential risks and highlights vulnerabilities without executing workflows.",
  }),

  createAgentContract({
    id: 4,
    name: "Document Classifier",
    description: "Classifies documents into categories.",
    authority_scope: "Classification only. No editing.",
    capability_type: "Classification",
    lifecycle_state: LIFECYCLE_STATES.SUSPENDED,
    load_visibility: false,
    governance_eligible: false,
    why_exists:
      "Categorizes documents into predefined classes for better organization and retrieval.",
  }),

  createAgentContract({
    id: 5,
    name: "Language Translator",
    description: "Translates between supported languages.",
    authority_scope: "Translation only. No summarization.",
    capability_type: "Language Processing",
    lifecycle_state: LIFECYCLE_STATES.ACTIVE,
    load_visibility: true,
    governance_eligible: true,
    why_exists:
      "Bridges communication gaps by translating text while preserving meaning.",
  }),

  createAgentContract({
    id: 6,
    name: "Workflow Router",
    description: "Routes tasks between agents.",
    authority_scope: "Routing only. No content processing.",
    capability_type: "Orchestration",
    lifecycle_state: LIFECYCLE_STATES.ACTIVE,
    load_visibility: false,
    governance_eligible: true,
    why_exists:
      "Coordinates task flow between agents without processing content.",
  }),
]);


/* -----------------------------------------------------
   DEV-ONLY IMMUTABILITY ENFORCEMENT TEST
----------------------------------------------------- */
/*
if (import.meta.env.DEV !== "production") {
  try {
    AgentRegistry[0].authority_scope = "HACKED";
    console.error("❌ Mutation succeeded — deep freeze failed.");
  } catch {
    console.log("✅ authority_scope mutation blocked.");
  }

  try {
    AgentRegistry.push({ id: 999 });
    console.error("❌ Registry array mutation succeeded.");
  } catch {
    console.log("✅ Registry array mutation blocked.");
  }
}*/