export const mockAgents = [
  {
    id: 1,
    name: "Text Summarizer",
    purpose: "Condenses long text into concise summaries.",
    authorityScope:
      "Authorized to process text inputs only. Cannot modify source data.",
    status: "Available",
    load: 25,
  },
  {
    id: 2,
    name: "Data Formatter",
    purpose: "Formats raw data into structured outputs.",
    authorityScope:
      "Can transform structured data formats but cannot access external systems.",
    status: "Busy",
    load: 70,
  },
  {
    id: 3,
    name: "Risk Evaluator",
    purpose: "Analyzes risk levels in provided datasets.",
    authorityScope:
      "Permitted to evaluate data and assign risk scores. No data storage access.",
    status: "Disabled",
    load: 0,
  },
  {
    id: 4,
    name: "Document Classifier",
    purpose: "Categorizes documents based on content.",
    authorityScope:
      "Can label documents but cannot delete or alter originals.",
    status: "Available",
    load: 40,
  },
  {
    id: 5,
    name: "Language Translator",
    purpose: "Translates text between supported languages.",
    authorityScope:
      "Authorized to translate content but cannot store user data.",
    status: "Available",
    load: 15,
  },
  {
    id: 6,
    name: "Workflow Router",
    purpose: "Routes tasks between selected agents.",
    authorityScope:
      "Can assign tasks to agents but cannot execute task logic.",
    status: "Busy",
    load: 55,
  },
];
