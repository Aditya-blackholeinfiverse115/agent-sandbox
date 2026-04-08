import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildActionProposal, CONTRACT_VERSION } from "./ActionProposal.js";
import { validateStructure } from "./StructuralValidator.js";
import { buildGovernanceRequest } from "./GovernanceHandshake.js";
import { validateActionProposal } from "./validateActionProposal.js";

vi.mock("../registry/RegistryInterface.js", () => ({
  RegistryInterface: {
    getAgentById: (id) => {
      const registry = {
        1: { id: 1, name: "Text Summarizer",    lifecycle_state: "Active" },
        2: { id: 2, name: "Data Formatter",      lifecycle_state: "Active" },
        3: { id: 3, name: "Risk Evaluator",      lifecycle_state: "Active" },
        4: { id: 4, name: "Document Classifier", lifecycle_state: "Suspended" },
        5: { id: 5, name: "Language Translator", lifecycle_state: "Active" },
        6: { id: 6, name: "Workflow Router",     lifecycle_state: "Active" },
      };
      const normalized = typeof id === "string" ? Number(id) : id;
      return registry[normalized] ?? null;
    },
  },
}));

beforeEach(() => vi.clearAllMocks());

const FIXED_TIMESTAMP = "2025-01-01T00:00:00.000Z";

function base(overrides = {}) {
  return {
    actor: "intent-router",
    action: "task.route",
    agents: ["6"],
    context: { task: "summarize-and-format" },
    _timestamp: FIXED_TIMESTAMP,
    ...overrides,
  };
}

// ─── TC-01  Valid case ───────────────────────────────────────────────────────

describe("TC-01 — valid single agent, passes structure", () => {
  it("returns traceability fields, lifecycle_valid=true, passes schema", () => {
    const proposal = buildActionProposal(base());

    expect(proposal.proposal_id).toMatch(/^ap-/);
    expect(proposal.timestamp).toBe(FIXED_TIMESTAMP);
    expect(proposal.contract_version).toBe(CONTRACT_VERSION);
    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.governance_request).toMatchObject({
      actor: "intent-router",
      action: "task.route",
      resource: ["6"],
    });
    expect(proposal.governance_request).not.toHaveProperty("response");
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(validateActionProposal(proposal)).toBe(true);
  });
});

// ─── TC-02  Valid multi-agent ─────────────────────────────────────────────────

describe("TC-02 — valid multi-agent, structure passes", () => {
  it("returns lifecycle_valid=true with governance_request containing all agents", () => {
    const proposal = buildActionProposal(base({ agents: ["6", "1"] }));

    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.governance_request.resource).toEqual(["6", "1"]);
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(validateActionProposal(proposal)).toBe(true);
  });
});

// ─── TC-03  actor=system ──────────────────────────────────────────────────────

describe("TC-03 — actor=system, structure passes", () => {
  it("returns lifecycle_valid=true — governance decision is not made here", () => {
    const proposal = buildActionProposal(base({ actor: "system" }));

    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.governance_request.actor).toBe("system");
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(validateActionProposal(proposal)).toBe(true);
  });
});

// ─── TC-04  Suspended agent ───────────────────────────────────────────────────

describe("TC-04 — invalid structure: suspended agent", () => {
  it("returns traceability fields, lifecycle_valid=false, governance_request=null", () => {
    const proposal = buildActionProposal(base({ agents: ["4"] }));

    expect(proposal.proposal_id).toMatch(/^ap-/);
    expect(proposal.timestamp).toBe(FIXED_TIMESTAMP);
    expect(proposal.contract_version).toBe(CONTRACT_VERSION);
    expect(proposal.constraints.lifecycle_valid).toBe(false);
    expect(proposal.governance_request).toBeNull();
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(validateActionProposal(proposal)).toBe(true);
  });
});

// ─── TC-05  validateStructure: suspended agent ────────────────────────────────

describe("TC-05 — validateStructure: suspended agent", () => {
  it("returns valid=false with AGENT_SUSPENDED error code", () => {
    const result = validateStructure([
      { id: 4, name: "Document Classifier", lifecycle_state: "Suspended" }
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toEqual({
      code: "AGENT_SUSPENDED",
      message: "Suspended agent detected: 4",
    });
  });
});

// ─── TC-06  Duplicate agents ──────────────────────────────────────────────────

describe("TC-06 — invalid structure: duplicate agents", () => {
  it("returns valid=false with DUPLICATE_AGENTS error code", () => {
    const agent = { id: 1, name: "Text Summarizer", lifecycle_state: "Active" };
    const result = validateStructure([agent, agent]);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toEqual({
      code: "DUPLICATE_AGENTS",
      message: "Duplicate agents detected",
    });
  });
});

// ─── TC-07  Risk Evaluator → Text Summarizer ─────────────────────────────────

describe("TC-07 — invalid structure: Risk Evaluator → Text Summarizer", () => {
  it("returns valid=false with INVALID_CHAIN error code", () => {
    const result = validateStructure([
      { id: 3, name: "Risk Evaluator",  lifecycle_state: "Active" },
      { id: 1, name: "Text Summarizer", lifecycle_state: "Active" },
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toEqual({
      code: "INVALID_CHAIN",
      message: "Invalid chaining: Risk Evaluator cannot precede Text Summarizer",
    });
  });
});

// ─── TC-08  Workflow Router → Data Formatter ──────────────────────────────────

describe("TC-08 — invalid structure: Workflow Router → Data Formatter", () => {
  it("returns valid=false with INVALID_CHAIN error code", () => {
    const result = validateStructure([
      { id: 6, name: "Workflow Router", lifecycle_state: "Active" },
      { id: 2, name: "Data Formatter",  lifecycle_state: "Active" },
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toEqual({
      code: "INVALID_CHAIN",
      message: "Invalid chaining: Workflow Router cannot precede Data Formatter",
    });
  });
});

// ─── TC-09  Agent not found in registry ──────────────────────────────────────

describe("TC-09 — agent not found in registry", () => {
  it("returns traceability fields, lifecycle_valid=false, governance_request=null", () => {
    const proposal = buildActionProposal(base({ agents: ["999"] }));

    expect(proposal.proposal_id).toMatch(/^ap-/);
    expect(proposal.timestamp).toBe(FIXED_TIMESTAMP);
    expect(proposal.contract_version).toBe(CONTRACT_VERSION);
    expect(proposal.constraints.lifecycle_valid).toBe(false);
    expect(proposal.governance_request).toBeNull();
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(validateActionProposal(proposal)).toBe(true);
  });
});

// ─── TC-10  proposal_id determinism ──────────────────────────────────────────

describe("TC-10 — proposal_id is deterministic", () => {
  it("same input always produces same proposal_id", () => {
    const input = base();
    expect(buildActionProposal(input).proposal_id).toBe(buildActionProposal(input).proposal_id);
  });

  it("different agents produce different proposal_id", () => {
    const id1 = buildActionProposal(base({ agents: ["6"] })).proposal_id;
    const id2 = buildActionProposal(base({ agents: ["1", "2"] })).proposal_id;
    expect(id1).not.toBe(id2);
  });
});

// ─── TC-11  buildGovernanceRequest — pure passthrough ────────────────────────

describe("TC-11 — buildGovernanceRequest is a pure passthrough", () => {
  it("returns the exact fields with no response or decision", () => {
    const req = buildGovernanceRequest({
      actor: "intent-router",
      action: "task.route",
      resource: ["6"],
      context: {},
    });

    expect(req).toEqual({ actor: "intent-router", action: "task.route", resource: ["6"], context: {} });
    expect(req).not.toHaveProperty("response");
  });
});
