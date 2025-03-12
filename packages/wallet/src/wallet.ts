"use client";
import {
  createGlobalWalletClient,
  GlobalWalletClient,
} from "@dynamic-labs/global-wallet-client";
import { WalletConfig } from "./config";

export const SophonWallet: GlobalWalletClient = createGlobalWalletClient({
  environmentId: WalletConfig.environmentId,
  popup: {
    url: WalletConfig.walletUrl,
  },
});
