import {
  connectorsForWallets,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { sophonTestnet } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { WalletTestnetConfig } from "@sophon-labs/account-core";
import {
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { injected } from "wagmi/connectors";

import "@sophon-labs/account-eip6963/testnet";

interface SophonProviderResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
  isInjected: boolean;
}

export interface MyWalletOptions {
  projectId: string;
}

const findSophonProvider = (): SophonProviderResult | null => {
  if (typeof window === "undefined") return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethereum = (window as any).ethereum;
  console.log(ethereum);

  if (!ethereum) return null;

  if (ethereum.info?.rdns === WalletTestnetConfig.eip6963.rdns) {
    return { provider: ethereum, isInjected: true };
  }

  if (ethereum.eip6963ProviderDetails?.length > 0) {
    const sophonProvider = ethereum.eip6963ProviderDetails.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (provider: any) =>
        provider.info?.rdns === WalletTestnetConfig.eip6963.rdns,
    );

    if (sophonProvider) {
      return { provider: sophonProvider.provider, isInjected: true };
    }
  }

  return { provider: null, isInjected: false };
};

export const sophonWallet = ({ projectId }: MyWalletOptions): Wallet => {
  const sophonProviderInfo = findSophonProvider();
  const isInjected = sophonProviderInfo?.isInjected ?? false;

  return {
    id: "sophon-testnet",
    name: WalletTestnetConfig.walletName,
    iconUrl: WalletTestnetConfig.walletIcon,
    iconBackground: "#985d3c",
    installed: isInjected,

    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: !isInjected
      ? {
          getUri: (uri: string) => uri,
          instructions: {
            learnMoreUrl: "https://docs.sophon.xyz",
            steps: [
              {
                description:
                  "Enjoy frictionless Web3 with Sophon Global Wallet.",
                step: "install",
                title: "Open the Sophon Global Wallet app",
              },
              {
                description:
                  "After you scan, a connection prompt will appear for you to connect your wallet.",
                step: "scan",
                title: "Tap the scan button",
              },
            ],
          },
        }
      : undefined,
    extension: !isInjected
      ? {
          instructions: {
            learnMoreUrl: "https://docs.sophon.xyz",
            steps: [
              {
                description:
                  "Enjoy frictionless Web3 with Sophon Global Wallet.",
                step: "install",
                title: "Install the Sophon Global Wallet extension",
              },
              {
                description:
                  "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
                step: "create",
                title: "Create or Import a Wallet",
              },
              {
                description:
                  "Once you set up your wallet, click below to refresh the browser and load up the extension.",
                step: "refresh",
                title: "Refresh your browser",
              },
            ],
          },
        }
      : undefined,
    createConnector: (walletDetails) => {
      if (isInjected && sophonProviderInfo?.provider) {
        return injected({
          target: {
            id: WalletTestnetConfig.eip6963.rdns,
            name: WalletTestnetConfig.walletName,
            provider: sophonProviderInfo.provider,
          },
        });
      } else {
        return getWalletConnectConnector({ projectId })(walletDetails);
      }
    },
  };
};

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [sophonWallet],
    },
    {
      groupName: "Common",
      wallets: [
        rainbowWallet,
        walletConnectWallet,
        metaMaskWallet,
        rabbyWallet,
      ],
    },
  ],
  {
    appName: "RainbowKit App",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  },
);

export const config = createConfig({
  connectors,
  transports: {
    [sophonTestnet.id]: http(),
  },
  chains: [sophonTestnet],
  ssr: true,
});
