import {
  type Hex,
  type PublicClient,
  type TypedData,
  type TypedDataDomain,
  hashTypedData,
  hashMessage,
  toBytes,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  TypedDataDefinition,
} from "viem";

// ERC-1271 magic value for valid signature
export const ERC1271_MAGIC_VALUE = "0x1626ba7e" as const;

// ERC-7739 type hash
const ERC7739_TYPE_HASH = keccak256(
  toBytes("TypedDataSign(bytes32 digest,bytes32 domainSeparator,bytes32 hashStruct)")
);

export interface ERC7739TypedData<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> {
  domain: TypedDataDomain;
  types: typedData;
  primaryType: primaryType;
  message: typedData[primaryType];
  verifierDomain?: TypedDataDomain;
}

export interface SignatureValidationOptions {
  /** Custom RPC URL for the client */
  rpcUrl?: string;
  /** Whether to use testnet (default: false) */
  testnet?: boolean;
}

/**
 * Wraps a signature with ERC-7739 typed data signature format
 */
export function wrapTypedDataSignature<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>(params: {
  signature: Hex;
  domain: TypedDataDomain;
  types: typedData;
  primaryType: primaryType;
  message: typedData[primaryType];
}): Hex {
  const { signature, domain, types, primaryType, message } = params;

  // Calculate domain separator
  const domainSeparator = hashTypedData({
    domain,
    types: { EIP712Domain: [] },
    primaryType: "EIP712Domain",
    message: undefined,
  });

  // Calculate digest
  const digest = hashTypedData({
    domain,
    types,
    primaryType,
    message,
  } as TypedDataDefinition);

  // Encode ERC-7739 wrapper
  const wrappedSignature = encodeAbiParameters(
    parseAbiParameters("bytes32, bytes32, bytes32, bytes"),
    [ERC7739_TYPE_HASH, digest, domainSeparator, signature]
  );

  return wrappedSignature;
}

/**
 * Validates an ERC-1271 signature for a smart contract account
 */
export async function validateERC1271Signature(
  client: PublicClient,
  params: {
    /** The smart contract account address */
    account: Hex;
    /** The message hash or raw message */
    message: Hex | string;
    /** The signature to validate */
    signature: Hex;
    /** Whether the message is already hashed */
    isMessageHashed?: boolean;
  }
): Promise<boolean> {
  const { account, message, signature, isMessageHashed = false } = params;

  try {
    // Hash the message if it's not already hashed
    const messageHash = isMessageHashed ? (message as Hex) : hashMessage(message as string);

    // Call isValidSignature on the smart contract
    const result = await client.readContract({
      address: account,
      abi: [
        {
          name: "isValidSignature",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "hash", type: "bytes32" },
            { name: "signature", type: "bytes" },
          ],
          outputs: [{ name: "", type: "bytes4" }],
        },
      ],
      functionName: "isValidSignature",
      args: [messageHash, signature],
    });

    return result === ERC1271_MAGIC_VALUE;
  } catch (error) {
    console.error("Error validating ERC-1271 signature:", error);
    return false;
  }
}

/**
 * Validates an ERC-7739 typed data signature for a smart contract account
 */
export async function validateERC7739Signature<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>(
  client: PublicClient,
  params: {
    /** The smart contract account address */
    account: Hex;
    /** The typed data to validate */
    typedData: ERC7739TypedData<typedData, primaryType>;
    /** The signature to validate */
    signature: Hex;
    /** Whether the signature is already wrapped with ERC-7739 format */
    isWrapped?: boolean;
  }
): Promise<boolean> {
  const { account, typedData, signature, isWrapped = false } = params;

  try {
    // Wrap the signature if not already wrapped
    const wrappedSignature = isWrapped
      ? signature
      : wrapTypedDataSignature({
          signature,
          domain: typedData.domain,
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: typedData.message,
        });

    // Calculate the typed data hash
    const messageHash = hashTypedData({
      domain: typedData.verifierDomain || typedData.domain,
      types: typedData.types,
      primaryType: typedData.primaryType,
      message: typedData.message,
    } as TypedDataDefinition);

    // Validate using ERC-1271
    return await validateERC1271Signature(client, {
      account,
      message: messageHash,
      signature: wrappedSignature,
      isMessageHashed: true,
    });
  } catch (error) {
    console.error("Error validating ERC-7739 signature:", error);
    return false;
  }
}

/**
 * Helper function to get EIP-712 domain from a contract
 */
export async function getEIP712Domain(
  client: PublicClient,
  contractAddress: Hex
): Promise<TypedDataDomain> {
  try {
    const result = (await client.readContract({
      address: contractAddress,
      abi: [
        {
          name: "eip712Domain",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [
            { name: "fields", type: "bytes1" },
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
            { name: "salt", type: "bytes32" },
            { name: "extensions", type: "uint256[]" },
          ],
        },
      ],
      functionName: "eip712Domain",
    })) as [Hex, string, string, bigint, Hex, Hex, bigint[]];

    const [, name, version, chainId, verifyingContract, salt] = result;

    return {
      name,
      version,
      chainId: Number(chainId),
      verifyingContract,
      ...(salt !== "0x0000000000000000000000000000000000000000000000000000000000000000" && {
        salt,
      }),
    };
  } catch (error) {
    console.error("Error getting EIP-712 domain:", error);
    throw new Error(`Failed to get EIP-712 domain from contract ${contractAddress}`);
  }
}

/**
 * Comprehensive signature validation that supports both ERC-1271 and ERC-7739
 */
export async function validateSignature(
  client: PublicClient,
  params: {
    /** The smart contract account address */
    account: Hex;
    /** The signature to validate */
    signature: Hex;
  } & (
    | {
        /** Raw message to validate */
        message: string;
        type: "message";
      }
    | {
        /** Message hash to validate */
        messageHash: Hex;
        type: "hash";
      }
    | {
        /** Typed data to validate */
        typedData: ERC7739TypedData;
        type: "typedData";
        /** Whether the signature is already wrapped */
        isWrapped?: boolean;
      }
  )
): Promise<boolean> {
  const { account, signature } = params;

  switch (params.type) {
    case "message":
      return validateERC1271Signature(client, {
        account,
        message: params.message,
        signature,
        isMessageHashed: false,
      });

    case "hash":
      return validateERC1271Signature(client, {
        account,
        message: params.messageHash,
        signature,
        isMessageHashed: true,
      });

    case "typedData":
      return (validateERC7739Signature as any)(client, {
        account,
        typedData: params.typedData,
        signature,
        isWrapped: params.isWrapped,
      });

    default:
      throw new Error("Invalid validation type");
  }
}
