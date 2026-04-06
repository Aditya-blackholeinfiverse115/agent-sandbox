import { buildActionProposal } from "../layer2/ActionProposal";
import { validateStructure } from "../layer2/StructuralValidator";
import { RegistryInterface } from "../registry/RegistryInterface";
import { intentRouterOutput } from "../layer2/intentRouterMock";

export default function Layer2Console() {
  const input = intentRouterOutput;

  const validation = validateStructure(
    input.agents.map(id => RegistryInterface.getAgentById(id)).filter(Boolean)
  );

  const proposal = buildActionProposal(input);

  return (
    <>
      <style>{`
        .layer2-console {
          margin: 20px 0px;
          border-radius: 12px;
          border: 1px solid #374151;
          background: #020617;
          overflow: hidden;
        }

        .layer2-header {
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #93c5fd;
          background: #020617;
          border-bottom: 1px solid #1e293b;
        }

        .layer2-section {
          border-bottom: 1px solid #0f172a;
        }

        .layer2-section:last-child {
          border-bottom: none;
        }

        .layer2-section-title {
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .04em;
          color: #64748b;
          background: #020617;
        }

        .layer2-pre {
          margin: 0;
          padding: 12px 14px;
          font-size: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          color: #e2e8f0;
          background: #070c14;
          overflow-x: auto;
        }
      `}</style>

      <div className="layer2-console">

        <Section title="INPUT">
          {JSON.stringify(input, null, 2)}
        </Section>

        <Section title="VALIDATION STATUS">
          {JSON.stringify(validation, null, 2)}
        </Section>

        <Section title="ACTION PROPOSAL (GOVERNANCE REQUEST)">
          {JSON.stringify(proposal, null, 2)}
        </Section>

      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="layer2-section">
      <div className="layer2-section-title">{title}</div>
      <pre className="layer2-pre">{children}</pre>
    </div>
  );
}
