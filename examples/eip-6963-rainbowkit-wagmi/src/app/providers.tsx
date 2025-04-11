"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SophonEIP6963Emitter } from "@sophon-labs/eip6963";

import { config } from "../wagmi";

// Initialize EIP-6963 emitter before creating providers
SophonEIP6963Emitter();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider
          appInfo={{
            appName: "Rainbowkit Demo",
            learnMoreUrl: "https://learnaboutcryptowallets.example",
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
