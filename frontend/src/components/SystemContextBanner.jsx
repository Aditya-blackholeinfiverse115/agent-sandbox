import React from "react";

const SystemContextBanner = ({
  registryVersion,
  contractVersion,
  mutationEnabled,
  governanceModel,
  systemContextDescription,
}) => {
  return (
    <div>
      <div className="system-context-banner">
        <div className="banner-item">
          <strong>Registry Version:</strong> {registryVersion}
        </div>

        <div className="banner-item">
          <strong>Contract Version:</strong> {contractVersion}
        </div>

        <div className="banner-item">
          <strong>Mutation Mode:</strong>{mutationEnabled}
        </div>

        <div className="banner-item">
          <strong>Governance Model:</strong> {governanceModel}
        </div>
      </div>

      <div className="system-banner">
        <strong>System Context:</strong> {systemContextDescription}
      </div>

    </div>
  );
};

export default SystemContextBanner;