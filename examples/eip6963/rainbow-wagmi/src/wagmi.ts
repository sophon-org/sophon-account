import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sophonTestnet, sophon } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  // connectors: [injected()],
  chains: [sophon, sophonTestnet],
  ssr: true,
});
