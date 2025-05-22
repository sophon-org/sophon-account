import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";

interface Props {
  children: React.ReactNode;
  buttonClassName?: string;
  buttonContainerClassName?: string;
}

export const SophonConnectButtonWidget: React.FC<Props> = ({
  children,
  ...props
}) => {
  return <DynamicConnectButton {...props}>{children}</DynamicConnectButton>;
};
