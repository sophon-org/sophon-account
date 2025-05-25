import { mainnet } from "viem/chains";
import { Address, createPublicClient, http } from "viem";
import { sophonTestnet } from "viem/chains";
import { snsRegistryAbi } from "./abis/SNSRegistryAbi";

const SNS_REGISTRY_ADDRESS = "0x5a1f427df38564e764f3e400137252989e92cc96";

export const resolveName = async (
  name: string,
  testnet?: boolean
): Promise<Address> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : mainnet,
    transport: http(),
  });
  const resolved = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "addr",
    args: [name],
  });
  return resolved as Address;
};

export const resolveAddress = async (
  address: string,
  testnet?: boolean
): Promise<string> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : mainnet,
    transport: http(),
  });
  const resolved = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "ownedDomains",
    args: [address],
  });
  return resolved[0];
};
