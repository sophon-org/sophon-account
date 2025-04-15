"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { sophon, sophonTestnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { State, WagmiProvider } from "wagmi";
import { SophonTestnetEIP6963Emitter } from "@sophon-labs/eip6963";

// Get projectId from <https://cloud.reown.com>
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  //optional
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Initialize EIP-6963 emitter
SophonTestnetEIP6963Emitter();

const wagmiAdapter = new WagmiAdapter({
  networks: [sophon, sophonTestnet],
  multiInjectedProviderDiscovery: false,
  projectId,
});

createAppKit({
  enableWalletConnect: false,
  enableEIP6963: true,
  adapters: [wagmiAdapter],
  networks: [sophon, sophonTestnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
    connectMethodsOrder: ["wallet", "social", "email"],
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
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
