export const mockAgents = [
  {
    id: 1,
    name: "Text Summarizer",
    description: "Condenses long text into concise summaries.",
    authority_scope: "Authorized to process text inputs only.",
    status: "Available",
    load: 25,
    refusal_reason: "Content policy violation detected."
  },
  {
    id: 2,
    name: "Data Formatter",
    description: "Formats raw data into structured output.",
    authority_scope: "Can restructure data but cannot modify meaning.",
    status: "Busy",
    load: 70,
    refusal_reason: "Unsupported input format."
  },
  {
    id: 3,
    name: "Risk Evaluator",
    description: "Evaluates operational and decision risk.",
    authority_scope: "Risk scoring only. No execution authority.",
    status: "Available",
    load: 40,
    refusal_reason: "Missing risk parameters."
  },
  {
    id: 4,
    name: "Document Classifier",
    description: "Classifies documents into categories.",
    authority_scope: "Classification only. No editing.",
    status: "Disabled",
    load: 0,
    refusal_reason: "Agent temporarily disabled."
  },
  {
    id: 5,
    name: "Language Translator",
    description: "Translates between supported languages.",
    authority_scope: "Translation only. No summarization.",
    status: "Available",
    load: 35,
    refusal_reason: "Unsupported language pair."
  },
  {
    id: 6,
    name: "Workflow Router",
    description: "Routes tasks between agents.",
    authority_scope: "Routing only. No content processing.",
    status: "Busy",
    load: 60,
    refusal_reason: "Routing conflict detected."
  }
];