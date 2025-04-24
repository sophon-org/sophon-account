"use client";

import { useSophonContext } from "@sophon-labs/react";

export default async function ExampleHookUsage() {
  const { primaryWallet } = useSophonContext();

  return (
    <div>
      Wallet: {primaryWallet?.address}, Balance:{" "}
      {await primaryWallet?.getBalance()}
    </div>
  );
}
