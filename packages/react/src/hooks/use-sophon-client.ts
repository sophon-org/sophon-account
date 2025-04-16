"use client";

import { useEffect, useState } from "react";
import { useSophonContext } from "./use-sophon-context";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { PublicClient, WalletClient } from "viem";
import { isZKsyncConnector } from "@dynamic-labs/ethereum-aa";
import { Wallet } from "@dynamic-labs/sdk-react-core";

interface ReturnType {
  sophonWallet: Wallet;
  publicClient: PublicClient;
  walletClient: WalletClient;
}

export const useSophonClient = (): ReturnType => {
  const { primaryWallet, sdkHasLoaded } = useSophonContext();
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  useEffect(() => {
    const call = async () => {
      console.log("shecin", sdkHasLoaded, primaryWallet);

      if (!sdkHasLoaded || !primaryWallet) {
        console.log(
          "no primary wallet or sdk loaded",
          sdkHasLoaded,
          primaryWallet
        );
        return;
      }

      console.log(
        "what?",
        isEthereumWallet(primaryWallet),
        isZKsyncConnector(primaryWallet.connector)
      );
      if (isZKsyncConnector(primaryWallet.connector)) {
        const ecdsaClient =
          primaryWallet.connector.getAccountAbstractionProvider();

        console.log("send", ecdsaClient);
        // await ecdsaClient.sendTransaction({
        //   to: "0x0000000000000000000000000000000000000001",
        //   value: parseEther("1"),
        //   from: ecdsaClient.account.address,
        // });
        // const publicClient = await ecdsaClient.pub;
        // const walletClient = await ecdsaClient.getWalletClient();

        console.log("ecdsa publicClient", publicClient);
        console.log("ecdsa walletClient", walletClient);

        setPublicClient(publicClient);
        setWalletClient(walletClient);
      } else if (isEthereumWallet(primaryWallet)) {
        const publicClient = await primaryWallet.getPublicClient();
        const walletClient = await primaryWallet.getWalletClient();

        console.log("publicClient", publicClient);
        console.log("walletClient", walletClient);

        setPublicClient(publicClient);
        setWalletClient(walletClient);
      }
    };
    call();
  }, [primaryWallet, sdkHasLoaded]);

  return {
    sophonWallet: primaryWallet,
    publicClient,
    walletClient,
  };
};
