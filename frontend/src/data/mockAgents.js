export const mockAgents = [
  {
    id: 1,
    name: "Text Summarizer",
    description: "Condenses long text into concise summaries.",
    authority_scope:
      "Authorized to process text inputs only. Cannot modify source data.",
    status: "Available",
    load: 25,
    refusal_reason: "Content policy violation detected in input text.",
  },
  {
    id: 2,
    name: "Data Formatter",
    description: "Formats raw data into structured outputs.",
    authority_scope:
      "Can transform structured data formats but cannot access external systems.",
    status: "Busy",
    load: 70,
    refusal_reason: "Invalid data detected.",
  },
  {
    id: 3,
    name: "Risk Evaluator",
    description: "Analyzes risk levels in provided datasets.",
    authority_scope:
      "Permitted to evaluate data and assign risk scores. No data storage access.",
    status: "Disabled",
    load: 0,
    refusal_reason: "Agent is disabled.",
  },
  {
    id: 4,
    name: "Document Classifier",
    description: "Categorizes documents based on content.",
    authority_scope:
      "Can label documents but cannot delete or alter originals.",
    status: "Available",
    load: 40,
    refusal_reason: "Invalid document format.",
  },
  {
    id: 5,
    name: "Language Translator",
    description: "Translates text between supported languages.",
    authority_scope:
      "Authorized to translate content but cannot store user data.",
    status: "Available",
    load: 15,
    refusal_reason: "Content policy violation detected in input text.",
  },
  {
    id: 6,
    name: "Workflow Router",
    description: "Routes tasks between selected agents.",
    authority_scope:
      "Can assign tasks to agents but cannot execute task logic.",
    status: "Busy",
    load: 55,
    refusal_reason: "No available agents to route tasks to.",

  },
];
