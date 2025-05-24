const PVT_KEY_OWNER =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
const FACTORY_ADDRESS = "0x9Bb2603866dD254d4065E5BA50f15F8F058F600E";
const SESSION_KEY_MODULE_ADDRESS = "0x3E9AEF9331C4c558227542D9393a685E414165a3";

import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sophonTestnet } from "viem/chains";
import { eip712WalletActions, getGeneralPaymasterInput } from "viem/zksync";
import { AAFactoryAbi } from "zksync-sso/abi";
import { createZksyncSessionClient } from "zksync-sso/client";
import { getCreateSessionTxForViem } from "./sessionHelper";
import { getInstallSessionKeyModuleTxForViem } from "./sessionHelper";

const customSophonTestnet = {
  ...sophonTestnet,
  // rpcUrls: {
  //   default: {
  //     http: ["http://0.0.0.0:8011"],
  //   },
  //   public: {
  //     http: ["http://0.0.0.0:8011"],
  //   },
  // },
};

const sessionConfig = (signerAddress) => {
  return {
    signer: signerAddress,
    expiresAt: BigInt(new Date(2025, 5, 31).getTime() / 1000),
    feeLimit: {
      limitType: 1,
      limit: 1000000000000000000n,
      period: 0n,
    },
    callPolicies: [],
    transferPolicies: [
      {
        target: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049" as `0x${string}`,
        maxValuePerUse: 1000000000000000000n,
        valueLimit: {
          limitType: 1,
          limit: 1000000000000000000n,
          period: 1000000000000000000n,
        },
      },
    ],
  };
};

const publicClient = createPublicClient({
  chain: customSophonTestnet,
  transport: http(),
});

const account = privateKeyToAccount(PVT_KEY_OWNER);

const walletClient = createWalletClient({
  chain: customSophonTestnet,
  transport: http(),
  account,
}).extend(eip712WalletActions());

const signerPvtKey = generatePrivateKey();
const signer = privateKeyToAccount(signerPvtKey);
const signerAddress = signer.address;

const uniqueID =
  "0x" +
  Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

const test = async () => {
  //deploy account
  const { request: deployReq, result: accountAddress } =
    await publicClient.simulateContract({
      account,
      address: FACTORY_ADDRESS,
      abi: AAFactoryAbi,
      functionName: "deployProxySsoAccount",
      args: [uniqueID as `0x${string}`, [], [account.address]],
      paymaster: "0x98546B226dbbA8230cf620635a1e4ab01F6A99B2",
      paymasterInput: getGeneralPaymasterInput({ innerInput: "0x" }),
    });

  const deployHash = await walletClient.writeContract(deployReq);
  await publicClient.waitForTransactionReceipt({ hash: deployHash });

  console.log(accountAddress);

  // const accountAddress = "0x28787C16334bC4D6963f7e0C80f0cCC60bEf2CE1";

  const transferHash = await walletClient.sendTransaction({
    to: accountAddress,
    value: parseEther("5"),
  });

  await publicClient.waitForTransactionReceipt({ hash: transferHash });

  const ecdsaClient = await createZksyncEcdsaClient({
    address: accountAddress,
    owner: account,
    chain: customSophonTestnet,
    transport: http(),
  });

  const installTx = getInstallSessionKeyModuleTxForViem({
    accountAddress,
  });

  const installHash = await ecdsaClient.sendTransaction(installTx);

  await ecdsaClient.waitForTransactionReceipt({
    hash: installHash,
  });

  const createSessionTx = getCreateSessionTxForViem(
    {
      sessionConfig: sessionConfig(signerAddress),
      paymaster: {
        address: "0x98546B226dbbA8230cf620635a1e4ab01F6A99B2",
        paymasterInput: getGeneralPaymasterInput({ innerInput: "0x" }),
      },
    },
    account.address,
  );

  const createSessionHash = await ecdsaClient.sendTransaction(createSessionTx);

  await ecdsaClient.waitForTransactionReceipt({
    hash: createSessionHash,
  });

  const sessionClient = createZksyncSessionClient({
    chain: customSophonTestnet,
    address: accountAddress,
    sessionKey: signerPvtKey,
    sessionConfig: sessionConfig(signerAddress),
    contracts: {
      session: SESSION_KEY_MODULE_ADDRESS,
    },
    transport: http(),
  });

  const tx = await sessionClient.sendTransaction({
    to: account.address,
    value: parseEther("1"),
    data: "0x",
  });

  console.log(tx);

  const result2 = await sessionClient.waitForTransactionReceipt({
    hash: tx,
  });

  console.log(result2);
};

test();
