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

export const createSophonEIP6963Emitter = (
  network: "mainnet" | "testnet",
  uuidOverride?: string
) => {
  const isSSR = () => typeof window === "undefined";
  if (isSSR()) {
    console.log("EIP6963 emitter isSSR call");
    return;
  }

  const isMainnet = network === "mainnet";
  const config = isMainnet ? WalletConfig : WalletTestnetConfig;
  const wallet = isMainnet ? SophonWallet : SophonTestnetWallet;

  console.log("creating emitter for", network, config);

  announceEip6963Provider({
    info: {
      icon: config.walletIcon,
      name: config.walletName,
      rdns: config.eip6963.rdns,
      uuid: uuidOverride ?? `sophon-${network}`,
    },
    provider: createEIP1193Provider(wallet),
  });
};
