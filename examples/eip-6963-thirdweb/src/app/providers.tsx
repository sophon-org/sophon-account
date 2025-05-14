"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, State, WagmiProvider } from "wagmi";

import "@sophon-labs/account-eip6963/testnet";
import { sophonTestnet } from "viem/chains";
import { ThirdwebProvider } from "thirdweb/react";

// Get projectId from <https://cloud.reown.com>
export const projectId = process.env.NEXT_PUBLIC_THIRDWEB_PROJECT_ID;

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

const config = createConfig({
  chains: [sophonTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [sophonTestnet.id]: http(),
  },
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <ThirdwebProvider>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  );
}
