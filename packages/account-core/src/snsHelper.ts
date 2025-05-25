import { mainnet } from "viem/chains";
import { Address, createPublicClient, http, isAddress } from "viem";
import { sophonTestnet } from "viem/chains";
import { snsRegistryAbi } from "./abis/SNSRegistryAbi";

const SNS_REGISTRY_ADDRESS = "0x3951eDF6D554FcB0327b4D5218Dd1B8BD90B456e";

export const resolveName = async (
  name: string,
  testnet?: boolean,
  rpcUrl?: string,
): Promise<Address> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : mainnet,
    transport: http(rpcUrl),
  });

  if (isAddress(name)) {
    throw new Error("An address is not a valid name");
  }

  // Clean up in case it was provided with the .soph.id suffix
  const _name = name.toLowerCase().replace(".soph.id", "");

  const resolved = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "addr",
    args: [`${_name}.soph.id`],
  });
  return resolved as Address;
};

export const resolveAddress = async (
  address: string,
  testnet?: boolean,
  rpcUrl?: string,
): Promise<string> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : mainnet,
    transport: http(rpcUrl),
  });

  if (!isAddress(address)) {
    throw new Error("You provided an invalid address");
  }

  const resolved = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "ownedDomains",
    args: [address],
  });
  return resolved[0];
};
