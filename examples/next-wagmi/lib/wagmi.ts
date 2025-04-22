import { http, createConfig } from "wagmi";
import { sophonTestnet } from "@sophon-labs/react";

export const config = createConfig({
  chains: [sophonTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [sophonTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
