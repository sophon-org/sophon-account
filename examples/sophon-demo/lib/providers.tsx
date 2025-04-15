"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import {
  SophonContextProvider,
  SophonWagmiConnector,
} from "@sophon-labs/react";
import { MantineProvider } from "@mantine/core";

const cssOverrides = `
.partner-custom-button {
  background-color: #ea3f3f;
}

.partner-custom-button:hover:enabled {
  background-color: #ee6969c7;
}
`;

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <MantineProvider
      classNamesPrefix="sophon-"
      withCssVariables
      withGlobalClasses
    >
      <SophonContextProvider
        partnerId="123b216c-678e-4611-af9a-2d5b7b061258"
        cssOverrides={cssOverrides}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <SophonWagmiConnector>{children}</SophonWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </SophonContextProvider>
    </MantineProvider>
  );
}
