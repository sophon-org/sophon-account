import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";

interface Props {
  children: React.ReactNode;
}

export const SophonConnectButtonWidget: React.FC<Props> = ({ children }) => {
  return (
    <>
      <DynamicConnectButton>{children}</DynamicConnectButton>
    </>
  );
};
