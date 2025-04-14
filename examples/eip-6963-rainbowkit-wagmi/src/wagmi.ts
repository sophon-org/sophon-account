import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sophonTestnet, sophon } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  transports: {
    useConnectors: true,
  },
  chains: [sophon, sophonTestnet],
  ssr: true,
});
