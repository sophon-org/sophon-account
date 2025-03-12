"use client";

import {
  announceEip6963Provider,
  createEIP1193Provider,
} from "@dynamic-labs/global-wallet-client/ethereum";
import { WalletConfig, SophonWallet } from "@sophon/wallet";

export const SophonEIP6963Emitter = () => {
  announceEip6963Provider({
    info: {
      icon: WalletConfig.walletIcon,
      name: WalletConfig.walletName,
      rdns: WalletConfig.eip6963.rdns,
      uuid: "sophon",
    },

    provider: createEIP1193Provider(SophonWallet),
  });
};
