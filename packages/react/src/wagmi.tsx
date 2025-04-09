import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

export const SophonWagmiConnector = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <DynamicWagmiConnector>{children}</DynamicWagmiConnector>;
};
