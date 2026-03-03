import React from "react";

const SystemContextBanner = ({
  registryVersion,
  contractVersion,
  mutationEnabled,
  governanceModel,
}) => {
  return (
    <div className="system-context-banner">
      <div className="banner-item">
        <strong>Registry Version:</strong> {registryVersion}
      </div>

      <div className="banner-item">
        <strong>Contract Version:</strong> {contractVersion}
      </div>

      <div className="banner-item">
        <strong>Mutation Mode:</strong>{" "}
        {mutationEnabled ? "Enabled" : "Disabled"}
      </div>

      <div className="banner-item">
        <strong>Governance Model:</strong> {governanceModel}
      </div>
    </div>
  );
};

export default SystemContextBanner;