export * from "./config";
export * from "./wallet";
export {
  connect,
  disconnect,
  onEvent,
  signMessage,
  switchNetwork,
  getWalletNetwork,
  getSupportedEthereumNetworks,
  getEthereumWallets,
} from "@dynamic-labs/global-wallet-client/features";
export { createEIP1193Provider } from "@dynamic-labs/global-wallet-client/ethereum";
export { isEthereumWallet } from "@dynamic-labs/ethereum";
export { isZKsyncConnector } from "@dynamic-labs/ethereum-aa-zksync";
export { SiwsMessage } from "./siws";
