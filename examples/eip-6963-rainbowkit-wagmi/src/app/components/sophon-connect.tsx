"use client";

import { Connector, useAccount, useAccountEffect, useConnectors } from "wagmi";
import { useEffect, useState } from "react";
import { SophonWallet, WalletConfig } from "@sophon-labs/wallet";

interface Props {
  authenticatedComponent: React.ReactNode;
}

export const SophonConnectButton: React.FC<Props> = ({
  authenticatedComponent,
}) => {
  const { isConnected } = useAccount();
  const [connector, setConnector] = useState<Connector>();

  const connectors = useConnectors();

  useAccountEffect({
    onDisconnect() {
      SophonWallet.disconnect();
    },
  });

  useEffect(() => {
    const sophonConnector = connectors.find(
      (connector) => connector.id === WalletConfig.eip6963.rdns,
    );
    if (sophonConnector) {
      setConnector(sophonConnector);
    }
  }, [connectors]);

  const onConnect = () => {
    connector?.connect();
  };

  if (!connector) {
    return (
      <a
        href="#"
        onClick={onConnect}
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "bold",
          padding: "8px",
          backgroundColor: "white",
          border: "1px solid #10151f59",
          borderRadius: "10px",
        }}
      >
        Loading...
      </a>
    );
  }

  if (!isConnected) {
    return (
      <a
        href="#"
        onClick={onConnect}
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "bold",
          padding: "8px",
          backgroundColor: "white",
          border: "1px solid #10151f59",
          borderRadius: "10px",
        }}
      >
        <img
          src={connector?.icon}
          alt={connector?.name}
          style={{ width: "24px", height: "24px" }}
        />
        {connector?.name}
      </a>
    );
  }

  return authenticatedComponent;
};
