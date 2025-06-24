"use client";

import { WagmiProvider, type State } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "@/lib/wagmi";
import { SophonContextProvider } from "@sophon-labs/account-react";
import { SophonWagmiConnector } from "@sophon-labs/account-wagmi";
import { useState } from "react";

export default function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [config] = useState(() => getConfig());

  return (
    <SophonContextProvider partnerId={"123b216c-678e-4611-af9a-2d5b7b061258"}>
      <WagmiProvider initialState={initialState} config={config}>
        <QueryClientProvider client={queryClient}>
          <SophonWagmiConnector>{children}</SophonWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </SophonContextProvider>
  );
}
