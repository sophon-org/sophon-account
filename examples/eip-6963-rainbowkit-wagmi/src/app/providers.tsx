"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SophonEIP6963Emitter } from "@sophon-labs/eip6963";

import { config } from "../wagmi";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new QueryClient();

  // Initialize EIP-6963 emitter
  SophonEIP6963Emitter();

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
