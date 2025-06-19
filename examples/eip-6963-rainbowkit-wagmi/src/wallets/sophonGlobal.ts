import { Wallet } from "@rainbow-me/rainbowkit";
import { injected } from "wagmi/connectors";
import { WalletTestnetConfig } from "@sophon-labs/account-core";

export const sophonGlobalWallet = (): Wallet => ({
  id: WalletTestnetConfig.eip6963.rdns,
  name: WalletTestnetConfig.walletName,
  iconUrl: WalletTestnetConfig.walletIcon,
  iconBackground: "#1a1a1a",
  downloadUrls: {
    browserExtension: WalletTestnetConfig.walletUrl,
    qrCode: WalletTestnetConfig.walletUrl,
  },
  extension: {
    instructions: {
      learnMoreUrl: WalletTestnetConfig.walletUrl,
      steps: [
        {
          description:
            "Install the Sophon Global Wallet extension to connect your account.",
          step: "install",
          title: "Install Sophon Global Wallet",
        },
        {
          description:
            "Create or import your Sophon account using the extension.",
          step: "create",
          title: "Create or Import Account",
        },
        {
          description:
            "Once setup is complete, refresh your browser to connect.",
          step: "refresh",
          title: "Refresh Browser",
        },
      ],
    },
  },
  createConnector: () => injected(),
});
