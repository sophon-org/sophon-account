import {
  type Address,
  type Chain,
  createPublicClient,
  encodeFunctionData,
  type Hex,
  http,
} from "viem";
import { SessionKeyValidatorAbi, SsoAccountAbi } from "zksync-sso/abi";
import { getGeneralPaymasterInput } from "viem/zksync";
import { createZksyncSessionClient } from "zksync-sso/client";
import { sophon, sophonTestnet } from "viem/chains";
import {
  CreateSessionArgs,
  InstallSessionKeyModuleArgs,
  SessionConfig,
} from "./types/session";

const SESSION_KEY_MODULE_ADDRESS: Address =
  "0x3E9AEF9331C4c558227542D9393a685E414165a3";

export const getViemSessionClient = (
  sessionConfig: SessionConfig,
  accountAddress: Address,
  signerPrivateKey: Hex,
  chain: Chain,
) => {
  const client = createZksyncSessionClient({
    chain,
    address: accountAddress,
    sessionKey: signerPrivateKey,
    sessionConfig,
    contracts: {
      session: SESSION_KEY_MODULE_ADDRESS,
    },
    transport: http(),
  });

  return client;
};

export const isSessionKeyModuleInstalled = async (
  address: Address,
  testnet?: boolean,
) => {
  const client = createPublicClient({
    chain: testnet ? sophonTestnet : sophon,
    transport: http(),
  });

  const isInstalled = await client.readContract({
    address: SESSION_KEY_MODULE_ADDRESS,
    abi: SessionKeyValidatorAbi,
    functionName: "isInitialized",
    args: [address],
  });

  return isInstalled;
};

export const getInstallSessionKeyModuleTxForViem = (
  args: InstallSessionKeyModuleArgs,
) => {
  const callData = encodeFunctionData({
    abi: SsoAccountAbi,
    functionName: "addModuleValidator",
    args: [SESSION_KEY_MODULE_ADDRESS, "0x"],
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return sendTransactionArgs;
};

export const getCreateSessionTxForViem = (
  args: Omit<CreateSessionArgs, "contracts">,
  accountAddress: Address,
) => {
  const _args = {
    ...args,
    contracts: { session: SESSION_KEY_MODULE_ADDRESS },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return sendTransactionArgs;
};
