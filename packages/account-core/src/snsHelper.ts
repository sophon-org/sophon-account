import { Address, createPublicClient, http, isAddress, namehash, pad, toHex } from "viem";
import { sophonTestnet, sophon } from "viem/chains";
import { snsRegistryAbi } from "./abis/SNSRegistryAbi";

const SNS_REGISTRY_ADDRESS = "0x3951eDF6D554FcB0327b4D5218Dd1B8BD90B456e";

export const resolveName = async (
  name: string,
  testnet?: boolean,
  rpcUrl?: string,
): Promise<Address> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : sophon,
    transport: http(rpcUrl),
  });

  if (isAddress(name)) {
    throw new Error("An address is not a valid name");
  }

  // Clean up in case it was provided with the .soph.id suffix
  const _name = `${name.toLowerCase().replace(".soph.id", "")}.soph.id`;

  const hash = namehash(_name);

  const resolved = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "addr",
    args: [hash],
  });
  return resolved as Address;
};

export const resolveAddress = async (
  address: string,
  testnet?: boolean,
  rpcUrl?: string,
): Promise<string> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : sophon,
    transport: http(rpcUrl),
  });

  if (!isAddress(address)) {
    throw new Error("You provided an invalid address");
  }

  const tokenId = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "tokenOfOwnerByIndex",
    args: [address, 0],
  });

  if (!tokenId) {
    throw new Error("No name found for this address");
  }

  const nameHash = pad(toHex(tokenId as bigint), { size: 32 });
  
  const name = await client.readContract({
    address: SNS_REGISTRY_ADDRESS,
    abi: snsRegistryAbi,
    functionName: "name",
    args: [nameHash],
  });

  return `${name}.soph.id` as string;
};
