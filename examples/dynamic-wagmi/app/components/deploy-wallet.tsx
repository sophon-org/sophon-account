import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isZKsyncConnector } from "@dynamic-labs/ethereum-aa";

export const DeployWallet = () => {
  const { primaryWallet } = useDynamicContext();

  const execute = async () => {
    const connector = primaryWallet?.connector;

    if (!connector) {
      throw new Error("No connector found");
    }

    if (!isZKsyncConnector(connector)) {
      throw new Error("Connector is not a ZkSync connector");
    }

    // This method will deploy a smart account using the ZkSync connector (without paymaster)
    // make sure the EOA for the smart account has funds for deployment
    await connector.deploySmartAccountWithPaymaster();
  };
  return <button onClick={execute}>DeployWallet</button>;
};
