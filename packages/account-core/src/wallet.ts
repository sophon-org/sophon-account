"use client";

import {
  createGlobalWalletClient,
  GlobalWalletClient,
} from "@dynamic-labs/global-wallet-client";
import { WalletConfig, WalletTestnetConfig } from "./config";

export const SophonWallet: GlobalWalletClient = createGlobalWalletClient({
  environmentId: WalletConfig.environmentId,
  popup: {
    url: WalletConfig.walletUrl,
  },
});

export const SophonTestnetWallet: GlobalWalletClient = createGlobalWalletClient(
  {
    environmentId: WalletTestnetConfig.environmentId,
    popup: {
      url: WalletTestnetConfig.walletUrl,
    },
  },
);
