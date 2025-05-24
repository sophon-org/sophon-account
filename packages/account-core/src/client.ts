import { Address, createPublicClient, http, sophon, sophonTestnet } from "viem";

export { createZksyncEcdsaClient as createSophonAccountECDSAClient } from "zksync-sso/client/ecdsa";
export { createZksyncSessionClient as createSophonAccountSessionClient } from "zksync-sso/client";

export const fetchAccountSigners = async (
  accountAddress: Address,
  testnet?: boolean,
) => {
  // const client = createPublicClient({
  //   chain: testnet ? sophonTestnet : sophon,
  //   transport: http(),
  // });
};
