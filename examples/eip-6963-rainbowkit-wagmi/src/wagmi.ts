import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sophonTestnet } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  transports: {
    [sophonTestnet.id]: http(),
  },
  chains: [sophonTestnet],
  ssr: true,
});
