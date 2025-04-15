import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sophonTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  multiInjectedProviderDiscovery: false,
  transports: {
    useConnectors: true,
  },
  chains: [sophonTestnet],
  ssr: true,
});
