import React from "react";

const SystemContextBanner = ({
  registryVersion,
  mutationEnabled,
}) => {
  return (
    <div className="system-context-banner">
      <div className="banner-item">
        <strong>Registry Version:</strong> {registryVersion}
      </div>

      <div className="banner-item">
        <strong>Mutation Mode:</strong>{" "}
        {mutationEnabled ? "Enabled" : "Disabled"}
      </div>

      <div className="banner-item">
        <strong>Governance Model:</strong>{" "}
        Contract-Level Eligibility (Deterministic)
      </div>
    </div>
  );
};

export default SystemContextBanner;