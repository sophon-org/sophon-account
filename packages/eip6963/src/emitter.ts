"use client";

import {
  announceEip6963Provider,
  createEIP1193Provider,
} from "@dynamic-labs/global-wallet-client/ethereum";
import {
  WalletConfig,
  SophonWallet,
  WalletTestnetConfig,
  SophonTestnetWallet,
} from "@sophon-labs/wallet";

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

export const SophonTestnetEIP6963Emitter = () => {
  announceEip6963Provider({
    info: {
      icon: WalletTestnetConfig.walletIcon,
      name: WalletTestnetConfig.walletName,
      rdns: WalletTestnetConfig.eip6963.rdns,
      uuid: "sophonTestnet",
    },

    provider: createEIP1193Provider(SophonTestnetWallet),
  });
};
