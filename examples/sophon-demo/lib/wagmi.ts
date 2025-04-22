import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { sophonTestnet } from "wagmi/chains";

export function getConfig() {
  return createConfig({
    chains: [sophonTestnet],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
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
