"use client";

import {
  connect,
  createEIP1193Provider,
  getSophonWallet,
  SiwsMessage,
} from "@sophon-labs/account-core";
import { getCsrfToken, signIn } from "next-auth/react";
import { createWalletClient, custom, type Hex } from "viem";
import { sophon, sophonTestnet } from "viem/chains";

export const LoginButton = () => {
  const handleConnect = async () => {
    const networkType = process.env.NETWORK_TYPE as "mainnet" | "testnet";
    const sophonWallet = await getSophonWallet(networkType);
    const currentNetwork = networkType === "mainnet" ? sophon : sophonTestnet;

    const connectedWallets = await connect(sophonWallet);

    if (!connectedWallets?.length) {
      throw new Error("No wallet connected");
    }

    const provider = createEIP1193Provider(sophonWallet);
    const walletClient = createWalletClient({
      account: connectedWallets[0].address as Hex,
      transport: custom(provider),
    });
    const messageBuilder: SiwsMessage = new SiwsMessage({
      domain: window.location.host,
      address: connectedWallets[0].address as `0x${string}`,
      statement: "Hello, world from Sophon and Next-Auth!",
      chainId: currentNetwork.id,
      nonce: await getCsrfToken(),
    });

    const message = messageBuilder.prepareMessage();
    const signature = await walletClient.signMessage({
      message,
    });

    await signIn("credentials", {
      message,
      redirect: false,
      signature,
      callbackUrl: "/",
      address: connectedWallets[0].address as `0x${string}`,
    });
  };

  return (
    <button
      type="button"
      style={{
        backgroundColor: "purple",
        padding: 10,
        borderRadius: 16,
        color: "white",
        cursor: "pointer",
      }}
      onClick={handleConnect}
    >
      Connect
    </button>
  );
};
