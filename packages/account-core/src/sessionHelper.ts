import {
  Address,
  Chain,
  encodeFunctionData,
  Hash,
  Hex,
  http,
  PublicClient,
} from "viem";
import { SessionKeyValidatorAbi } from "zksync-sso/abi";
import { SessionConfig } from "./types/session";
import { getGeneralPaymasterInput } from "viem/zksync";
import { SsoAccountAbi } from "./abis/SsoAccount";
import { createZksyncSessionClient } from "zksync-sso/client";
import { Provider, SmartAccount } from "zksync-ethers";
import { AbiCoder, Interface, Wallet } from "ethers";

const SESSION_KEY_MODULE_ADDRESS: Address =
  "0x3E9AEF9331C4c558227542D9393a685E414165a3";

type CreateSessionArgs = {
  sessionConfig: SessionConfig;
  contracts: {
    session: Address;
  };
  paymaster?: {
    address: Address;
    paymasterInput?: Hex;
  };
  onTransactionSent?: (hash: Hash) => void;
};

type InstallSessionKeyModuleArgs = {
  accountAddress: Address;
  paymaster?: {
    address: Address;
    paymasterInput?: Hex;
  };
};

export const getViemSessionClient = (
  sessionConfig: SessionConfig,
  accountAddress: Address,
  signerPrivateKey: Hex,
  chain: Chain
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

export const getSessionKeySignerAccount = (
  accountAddress: Address,
  signerPrivateKey: Hex,
  sessionConfig: SessionConfig
) => {
  const abiCoder = new AbiCoder();

  const wallet = new Wallet(signerPrivateKey);

  const iface = new Interface(SessionKeyValidatorAbi);

  // Get the FunctionFragment for "myFunction"
  const createSessionFrag = iface.getFunction("createSession");

  const sessionAccount = new SmartAccount(
    {
      payloadSigner: async (hash) => {
        console.log(createSessionFrag.inputs[0]);
        console.log(sessionConfig);

        return abiCoder.encode(
          ["bytes", "address", "bytes"],
          [
            wallet.signingKey.sign(hash).serialized,
            SESSION_KEY_MODULE_ADDRESS,
            abiCoder.encode(
              [createSessionFrag.inputs[0], "uint64[]"],
              [sessionConfig, [1, 1000000000000000000n, 0n]]
            ),
          ]
        );
      },
      address: accountAddress,
      secret: signerPrivateKey,
    },
    new Provider("https://rpc.testnet.sophon.xyz")
  );

  return sessionAccount;
};

export const isSessionKeyModuleInstalled = async (
  client: PublicClient,
  address: Address
) => {
  const isInstalled = await client.readContract({
    address: SESSION_KEY_MODULE_ADDRESS,
    abi: SessionKeyValidatorAbi,
    functionName: "isInitialized",
    args: [address],
  });

  return isInstalled;
};

export const getInstallSessionKeyModuleTx = (
  args: InstallSessionKeyModuleArgs
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
    gas: 10_000_000, // TODO: Remove when gas estimation is fixed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return sendTransactionArgs;
};

export const getCreateSessionTxForViem = (
  args: Omit<CreateSessionArgs, "contracts">,
  accountAddress: Address
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
    gas: 10_000_000, // TODO: Remove when gas estimation is fixed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return sendTransactionArgs;
};

// export const clientFromViem = (client: PublicClient | WalletClient) => {
//   const listSigners = async (address?: Address) => {
//     const _address = address ?? client.account?.address;

//     if (!_address) {
//       throw new Error("No account address provided");
//     }

//     const eoaSigners = client.readContract({
//       address: _address,
//       abi: SsoAccountAbi,
//       functionName: "listK1Owners",
//     });
//     const otherSigners = client.readContract({
//       address: _address,
//       abi: SsoAccountAbi,
//       functionName: "listModuleValidators",
//     });
//     const signers = await Promise.all([eoaSigners, otherSigners]).then(
//       ([eoaSigners, otherSigners]) => {
//         return {
//           eoaSigners,
//           otherSigners,
//         };
//       }
//     );
//     return signers;
//   };

//   const addEOASigner = async (newSignerAddress: Address) => {
//     await (client as WalletClient).writeContract({
//       address: client.account.address,
//       abi: SsoAccountAbi,
//       functionName: "addK1Owner",
//       args: [newSignerAddress],
//       account: client.account,
//     });
//   };

//   const createSession = async (sessionId: string) => {
//     await (client as WalletClient).writeContract({
//       address: client.account.address,
//       abi: SsoAccountAbi,
//       functionName: "createSession",
//     });
//   };

//   return {
//     listSigners,
//     addEOASigner,
//   };
// };
