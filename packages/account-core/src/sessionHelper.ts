import {
  type Address,
  type Chain,
  createPublicClient,
  encodeFunctionData,
  type Hex,
  http,
  keccak256,
} from "viem";
import { SessionKeyValidatorAbi, SsoAccountAbi } from "zksync-sso/abi";
import { getGeneralPaymasterInput } from "viem/zksync";
import {
  createZksyncSessionClient,
  type ZksyncSsoSessionClient,
} from "zksync-sso/client";
import { sophon, sophonTestnet } from "viem/chains";
import {
  SessionState,
  type CreateSessionArgs,
  type InstallSessionKeyModuleArgs,
  type SessionConfig,
} from "./types/session";
import { encodeSession, SessionStatus } from "zksync-sso/utils";
import { SOPHON_SESSION_KEY_MODULE_ADDRESS } from "./utils";

export function getSessionHash(sessionConfig: SessionConfig): `0x${string}` {
  return keccak256(encodeSession(sessionConfig));
}

export async function getSessionState({
  accountAddress,
  sessionConfig,
  testnet = true,
}: {
  accountAddress: Address;
  sessionConfig: SessionConfig;
  testnet: boolean;
}): Promise<SessionState> {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : sophon,
    transport: http(),
  });

  const result = await client.readContract({
    address: SOPHON_SESSION_KEY_MODULE_ADDRESS,
    abi: SessionKeyValidatorAbi,
    functionName: "sessionState",
    args: [accountAddress, sessionConfig],
  });

  return result as SessionState;
}

export async function getSessionStatus({
  accountAddress,
  sessionConfig,
  testnet,
}: {
  accountAddress: Address;
  sessionConfig: SessionConfig;
  testnet: boolean;
}): Promise<SessionStatus>;

export async function getSessionStatus({
  accountAddress,
  sessionHash,
  testnet,
}: {
  accountAddress: Address;
  sessionHash: `0x${string}`;
  testnet: boolean;
}): Promise<SessionStatus>;

export async function getSessionStatus({
  accountAddress,
  sessionConfig,
  sessionHash,
  testnet = true,
}: {
  accountAddress: Address;
  sessionConfig?: SessionConfig;
  sessionHash?: `0x${string}`;
  testnet: boolean;
}): Promise<SessionStatus> {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : sophon,
    transport: http(),
  });

  const hash = sessionHash ?? getSessionHash(sessionConfig);

  // Call the getState function on the session key module
  const result = await client.readContract({
    address: SOPHON_SESSION_KEY_MODULE_ADDRESS,
    abi: SessionKeyValidatorAbi,
    functionName: "sessionStatus",
    args: [accountAddress, hash],
  });

  return result;
}

export const getViemSessionClient = (
  sessionConfig: SessionConfig,
  accountAddress: Address,
  signerPrivateKey: Hex,
  chain: Chain,
): ZksyncSsoSessionClient => {
  const client = createZksyncSessionClient({
    chain,
    address: accountAddress,
    sessionKey: signerPrivateKey,
    sessionConfig,
    contracts: {
      session: SOPHON_SESSION_KEY_MODULE_ADDRESS,
    },
    transport: http(),
  });

  return client;
};

export const isSessionKeyModuleInstalled = async (
  address: Address,
  testnet: boolean = true,
): Promise<boolean> => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : sophon,
    transport: http(),
  });

  try {
    const isInstalled = await client.readContract({
      address: SOPHON_SESSION_KEY_MODULE_ADDRESS,
      abi: SessionKeyValidatorAbi,
      functionName: "isInitialized",
      args: [address],
    });

    return isInstalled as boolean;
  } catch {
    return false;
  }
};

export const getInstallSessionKeyModuleTxForViem = (
  args: InstallSessionKeyModuleArgs,
) => {
  const callData = encodeFunctionData({
    abi: SsoAccountAbi,
    functionName: "addModuleValidator",
    args: [SOPHON_SESSION_KEY_MODULE_ADDRESS, "0x"],
  });

  const sendTransactionArgs = {
    from: args.accountAddress,
    to: args.accountAddress,
    paymaster: args.paymaster?.address,
    paymasterInput: args.paymaster?.address
      ? args.paymaster?.paymasterInput ||
        getGeneralPaymasterInput({ innerInput: "0x" })
      : undefined,
    data: callData,
  };

  return sendTransactionArgs;
};

export const getCreateSessionTxForViem = (
  args: Omit<CreateSessionArgs, "contracts">,
  accountAddress: Address,
) => {
  const _args = {
    ...args,
    contracts: { session: SOPHON_SESSION_KEY_MODULE_ADDRESS },
  };

  const callData = encodeFunctionData({
    abi: SessionKeyValidatorAbi,
    functionName: "createSession",
    args: [_args.sessionConfig],
  });

  const sendTransactionArgs = {
    from: accountAddress,
    to: _args.contracts.session,
    paymaster: args.paymaster?.address,
    paymasterInput: args.paymaster?.address
      ? args.paymaster?.paymasterInput ||
        getGeneralPaymasterInput({ innerInput: "0x" })
      : undefined,
    data: callData,
  };

  return sendTransactionArgs;
};
