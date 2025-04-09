import { http, createConfig } from "wagmi";
import { sophon, sophonTestnet } from "@sophon-labs/react";

export const config = createConfig({
  chains: [sophon, sophonTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [sophon.id]: http(),
    [sophonTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
