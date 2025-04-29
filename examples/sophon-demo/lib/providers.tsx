"use client";

import { State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "@/lib/wagmi";
import { SophonContextProvider } from "@sophon-labs/account-react";
import { SophonWagmiConnector } from "@sophon-labs/account-wagmi";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";

const cssOverrides = `
.partner-custom-button {
  background-color: #ea3f3f;
}

.partner-custom-button:hover:enabled {
  background-color: #ee6969c7;
}
`;

export default function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

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
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <SophonWagmiConnector>{children}</SophonWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </SophonContextProvider>
    </MantineProvider>
  );
}
