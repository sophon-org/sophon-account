import { createThirdwebClient } from "thirdweb";
import { http } from "viem";
import { sophonTestnet } from "viem/chains";
import { createConfig, injected } from "wagmi";

// Get projectId from <https://cloud.reown.com>
export const projectId = process.env.NEXT_PUBLIC_THIRDWEB_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const client = createThirdwebClient({
  clientId: projectId,
});

export const config = createConfig({
  chains: [sophonTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [sophonTestnet.id]: http(),
  },
  connectors: [injected()],
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
