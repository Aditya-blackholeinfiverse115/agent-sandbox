import { buildActionProposal } from "../layer2/ActionProposal";
import { validateStructure } from "../layer2/StructuralValidator";
import { simulateGovernance } from "../layer2/GovernanceHandshake";

export default function Layer2Console() {

  const input = {
    actor: "intent-router",
    action: "weather.fetch",
    agents: ["weather.agent"],
    context: { city: "Mumbai" }
  };

  const validation = validateStructure(input.agents);

  const governance = simulateGovernance({
    actor: input.actor,
    action: input.action,
    resource: input.agents,
    context: input.context
  });

  const proposal = buildActionProposal(input);

  return (
    <div style={styles.console}>
      <h2>Layer-2 Deterministic Debug Console</h2>

      <Section title="Input">
        {JSON.stringify(input, null, 2)}
      </Section>

      <Section title="Validation Status">
        {JSON.stringify(validation, null, 2)}
      </Section>

      <Section title="Governance Request">
        {JSON.stringify(governance.request, null, 2)}
      </Section>

      <Section title="Governance Response">
        {governance.response}
      </Section>

      <Section title="Final ActionProposal">
        {JSON.stringify(proposal, null, 2)}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.block}>
      <div style={styles.title}>{title}</div>
      <pre style={styles.pre}>{children}</pre>
    </div>
  );
}

const styles = {
  console: {
    background: "#0b0f14",
    color: "#00ff9c",
    padding: 20,
    fontFamily: "monospace",
    minHeight: "100vh"
  },
  block: {
    marginBottom: 20,
    border: "1px solid #1e2a36",
    padding: 10
  },
  title: {
    color: "#00d9ff",
    marginBottom: 8
  },
  pre: {
    whiteSpace: "pre-wrap"
  }
};