"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";

import "@sophon-labs/account-eip6963/testnet";
import { ThirdwebProvider } from "thirdweb/react";

import { config } from "./wagmi";

const queryClient = new QueryClient();

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
