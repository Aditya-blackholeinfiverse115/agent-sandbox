export const mockAgents = [
  {
    id: 1,
    name: "Text Summarizer",
    description: "Condenses long text into concise summaries.",
    authority_scope: "Authorized to process text inputs only.",
    status: "Available",
    load: 25,
    refusal_reason: "Content policy violation detected.",
    why_exists:
      "This agent exists to reduce cognitive load by transforming long-form text into concise summaries. It helps users quickly understand key ideas without altering the original meaning. It does not interpret intent or execute decisions.",
  },
  {
    id: 2,
    name: "Data Formatter",
    description: "Formats raw data into structured output.",
    authority_scope: "Can restructure data but cannot modify meaning.",
    status: "Busy",
    load: 70,
    refusal_reason: "Unsupported input format.",
    why_exists:
      "This agent exists to ensure consistency and structure in raw or unorganized data. It improves readability and downstream processing efficiency. It cannot change semantic meaning or perform analytical decisions."

  },
  {
    id: 3,
    name: "Risk Evaluator",
    description: "Evaluates operational and decision risk.",
    authority_scope: "Risk scoring only. No execution authority.",
    status: "Available",
    load: 40,
    refusal_reason: "Missing risk parameters.",
    why_exists:
      "This agent exists to assess potential risks in workflows or decisions. It provides risk scoring and highlights potential vulnerabilities. It does not take action or execute workflows — it only evaluates."
  },
  {
    id: 4,
    name: "Document Classifier",
    description: "Classifies documents into categories.",
    authority_scope: "Classification only. No editing.",
    status: "Disabled",
    load: 0,
    refusal_reason: "Agent temporarily disabled.",
    why_exists:
      "This agent exists to automatically categorize documents into predefined classes for better organization and retrieval. It does not modify content and cannot generate or edit documents."
  },
  {
    id: 5,
    name: "Language Translator",
    description: "Translates between supported languages.",
    authority_scope: "Translation only. No summarization.",
    status: "Available",
    load: 35,
    refusal_reason: "Unsupported language pair.",
    why_exists:
      "This agent exists to bridge communication gaps by translating text between supported languages. It preserves meaning during translation but does not summarize, analyze, or modify intent."
  },
  {
    id: 6,
    name: "Workflow Router",
    description: "Routes tasks between agents.",
    authority_scope: "Routing only. No content processing.",
    status: "Busy",
    load: 60,
    refusal_reason: "Routing conflict detected.",
    why_exists:
      "This agent exists to coordinate task flow between other agents in the system. It ensures structured orchestration but does not process, modify, or interpret content itself."
  }
];