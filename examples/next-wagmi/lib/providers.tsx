"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import {
  SophonContextProvider,
  SophonWagmiConnector,
} from "@sophon-labs/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <SophonContextProvider partnerId={"123b216c-678e-4611-af9a-2d5b7b061258"}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <SophonWagmiConnector>{children}</SophonWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </SophonContextProvider>
  );
}
