import { sophonTestnet } from "wagmi/chains";
import { http, createConfig } from "wagmi";

export function getConfig() {
  return createConfig({
    chains: [sophonTestnet],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
      [sophonTestnet.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
