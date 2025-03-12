"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@/lib/wagmi";

export type SophonProviderProps = React.PropsWithChildren<{
  theme?: "auto" | "light" | "dark";
}>;

const cssOverrides = `
.wallet-list-item__tile:hover > img {
  animation: rotate 1s forwards;
}

.dynamic-footer {
  display: none;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        cssOverrides,
        environmentId: "767555fd-deac-4852-bdf2-ec4442697ea7",
        walletConnectors: [EthereumWalletConnectors],
        termsOfServiceUrl: "https://sophon.xyz/terms",
        privacyPolicyUrl: "https://sophon.xyz/privacy",
        customTermsOfServices: (
          <a
            className="powered-by-dynamic powered-by-dynamic--center"
            href="https://sophon.xyz/terms"
            style={{
              marginTop: "8px",
            }}
          >
            <span className="typography typography--body-mini typography--regular typography--tertiary  powered-by-dynamic__text">
              Powered by <b>Sophon</b>
            </span>
          </a>
        ),
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
