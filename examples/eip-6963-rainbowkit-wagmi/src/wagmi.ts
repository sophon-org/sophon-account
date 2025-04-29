import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sophonTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "0cdd2bff477264e03527f8642477a601",
  transports: {
    useConnectors: true,
  },
  chains: [sophonTestnet],
  ssr: true,
});
