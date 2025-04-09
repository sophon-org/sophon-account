import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";
import { cn } from "../utils";

type ViewProps = React.ComponentProps<typeof DynamicConnectButton>;

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
