import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { sophonTestnet } from "wagmi/chains";
import { sophonGlobalWallet } from "./wallets/sophonGlobal";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Sophon",
      wallets: [sophonGlobalWallet],
    },
  ],
  {
    appName: "RainbowKit App",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  },
);

export const config = createConfig({
  connectors,
  chains: [sophonTestnet],
  transports: {
    [sophonTestnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
  ssr: true,
});
