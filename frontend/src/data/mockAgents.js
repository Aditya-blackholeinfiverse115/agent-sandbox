export const mockAgents = [
  {
    id: 1,
    name: "Text Summarizer",
    description: "Condenses long text into concise summaries.",
    authority_scope: "Authorized to process text inputs only.",
    status: "Available",
    load: 20,
    refusal_reason: "Input violates content safety rules."
  },
  {
    id: 2,
    name: "Data Formatter",
    description: "Transforms raw data into structured formats.",
    authority_scope: "Can restructure data but cannot alter meaning.",
    status: "Busy",
    load: 75,
    refusal_reason: "Unsupported data format."
  },
  {
    id: 3,
    name: "Risk Evaluator",
    description: "Assesses potential risks in given scenarios.",
    authority_scope: "Risk scoring only. No decision authority.",
    status: "Available",
    load: 40,
    refusal_reason: "Insufficient risk parameters provided."
  },
  {
    id: 4,
    name: "Document Classifier",
    description: "Categorizes documents into predefined labels.",
    authority_scope: "Classification only. No content editing.",
    status: "Disabled",
    load: 0,
    refusal_reason: "Agent temporarily disabled by system."
  },
  {
    id: 5,
    name: "Language Translator",
    description: "Translates text between supported languages.",
    authority_scope: "Translation only. No summarization.",
    status: "Available",
    load: 30,
    refusal_reason: "Unsupported language pair."
  },
  {
    id: 6,
    name: "Workflow Router",
    description: "Routes tasks between agents in a chain.",
    authority_scope: "Task routing only. No data processing.",
    status: "Busy",
    load: 60,
    refusal_reason: "Routing conflict detected."
  }
];