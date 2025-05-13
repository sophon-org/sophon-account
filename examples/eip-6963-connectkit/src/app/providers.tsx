"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, State, WagmiProvider } from "wagmi";

import "@sophon-labs/account-eip6963/testnet";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { sophonTestnet } from "viem/chains";

// Get projectId from <https://cloud.reown.com>
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

const config = createConfig(
  getDefaultConfig({
    chains: [sophonTestnet],
    transports: {
      [sophonTestnet.id]: http(),
    },

    walletConnectProjectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",

    appName: "Sophon Account",
    appDescription: "Sophon Account",
    appUrl: "https://sophon.xyz",
    appIcon: "https://family.co/logo.png",
  })
);

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
