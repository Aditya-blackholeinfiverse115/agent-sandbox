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
    const result   = validateActionProposal(proposal);

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
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── TC-02  Valid multi-agent ─────────────────────────────────────────────────

describe("TC-02 — valid multi-agent, structure passes", () => {
  it("returns lifecycle_valid=true with governance_request containing all agents", () => {
    const proposal = buildActionProposal(base({ agents: ["6", "1"] }));
    const result   = validateActionProposal(proposal);

    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.governance_request.resource).toEqual(["6", "1"]);
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── TC-03  actor=system ──────────────────────────────────────────────────────

describe("TC-03 — actor=system, structure passes", () => {
  it("returns lifecycle_valid=true — governance decision is not made here", () => {
    const proposal = buildActionProposal(base({ actor: "system" }));
    const result   = validateActionProposal(proposal);

    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.governance_request.actor).toBe("system");
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── TC-04  Suspended agent ───────────────────────────────────────────────────

describe("TC-04 — invalid structure: suspended agent", () => {
  it("returns traceability fields, lifecycle_valid=false, governance_request=null, passes schema", () => {
    const proposal = buildActionProposal(base({ agents: ["4"] }));
    const result   = validateActionProposal(proposal);

    expect(proposal.proposal_id).toMatch(/^ap-/);
    expect(proposal.timestamp).toBe(FIXED_TIMESTAMP);
    expect(proposal.contract_version).toBe(CONTRACT_VERSION);
    expect(proposal.constraints.lifecycle_valid).toBe(false);
    expect(proposal.governance_request).toBeNull();
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
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
    const agent  = { id: 1, name: "Text Summarizer", lifecycle_state: "Active" };
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
  it("returns traceability fields, lifecycle_valid=false, governance_request=null, passes schema", () => {
    const proposal = buildActionProposal(base({ agents: ["999"] }));
    const result   = validateActionProposal(proposal);

    expect(proposal.proposal_id).toMatch(/^ap-/);
    expect(proposal.timestamp).toBe(FIXED_TIMESTAMP);
    expect(proposal.contract_version).toBe(CONTRACT_VERSION);
    expect(proposal.constraints.lifecycle_valid).toBe(false);
    expect(proposal.governance_request).toBeNull();
    expect(proposal).not.toHaveProperty("approved");
    expect(proposal).not.toHaveProperty("reason");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
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

// ─── TC-12  MISSING_FIELD — required field absent ────────────────────────────

describe("TC-12 — MISSING_FIELD: required field absent", () => {
  it("returns MISSING_FIELD error for missing actor", () => {
    const proposal = buildActionProposal(base());
    const { actor: _removed, ...withoutActor } = proposal;
    const result = validateActionProposal(withoutActor);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "MISSING_FIELD",
      field: "actor",
      message: "Required field \"actor\" is missing",
    });
  });

  it("returns MISSING_FIELD error for missing governance_request", () => {
    const proposal = buildActionProposal(base());
    const { governance_request: _removed, ...withoutGR } = proposal;
    const result = validateActionProposal(withoutGR);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "MISSING_FIELD",
      field: "governance_request",
      message: "Required field \"governance_request\" is missing",
    });
  });
});

// ─── TC-13  FORBIDDEN_FIELD — decision fields rejected ───────────────────────

describe("TC-13 — FORBIDDEN_FIELD: decision fields rejected", () => {
  it("returns FORBIDDEN_FIELD error for approved", () => {
    const proposal = { ...buildActionProposal(base()), approved: true };
    const result   = validateActionProposal(proposal);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "FORBIDDEN_FIELD",
      field: "approved",
      message: "Field \"approved\" is not permitted — no decision fields allowed",
    });
  });

  it("returns FORBIDDEN_FIELD error for reason", () => {
    const proposal = { ...buildActionProposal(base()), reason: "some reason" };
    const result   = validateActionProposal(proposal);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "FORBIDDEN_FIELD",
      field: "reason",
      message: "Field \"reason\" is not permitted — no decision fields allowed",
    });
  });
});

// ─── TC-14  UNKNOWN_FIELD — extra fields rejected ────────────────────────────

describe("TC-14 — UNKNOWN_FIELD: extra fields rejected", () => {
  it("returns UNKNOWN_FIELD error for unrecognised field", () => {
    const proposal = { ...buildActionProposal(base()), extra_field: "surprise" };
    const result   = validateActionProposal(proposal);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "UNKNOWN_FIELD",
      field: "extra_field",
      message: "Unknown field \"extra_field\" is not part of the contract",
    });
  });
});

// ─── TC-15  INVALID_TYPE — wrong type on required field ──────────────────────

describe("TC-15 — INVALID_TYPE: wrong type on required field", () => {
  it("returns INVALID_TYPE error when agents is not an array", () => {
    const proposal = { ...buildActionProposal(base()), agents: "not-an-array" };
    const result   = validateActionProposal(proposal);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "INVALID_TYPE",
      field: "agents",
      message: "Must be an array",
    });
  });
});

// ─── TC-16  INVALID_GOVERNANCE_REQUEST — response field rejected ─────────────

describe("TC-16 — INVALID_GOVERNANCE_REQUEST: response field inside governance_request", () => {
  it("returns FORBIDDEN_FIELD error for governance_request.response", () => {
    const proposal = buildActionProposal(base());
    const tampered = {
      ...proposal,
      governance_request: { ...proposal.governance_request, response: "allow" },
    };
    const result = validateActionProposal(tampered);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      code: "FORBIDDEN_FIELD",
      field: "governance_request.response",
      message: "Field \"response\" is not permitted inside governance_request",
    });
  });
});
