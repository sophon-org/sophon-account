"use client";

import { Button, Stack } from "@mantine/core";
import {
  SophonConnectButtonWidget,
  SophonUserProfile,
  shortenAddress,
  useIsLoggedIn,
  useSophonContext,
} from "@sophon-labs/account-react";
import { DogIcon, RabbitIcon } from "lucide-react";

export default function ExampleComponent() {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet, setShowSophonAccountProfile } = useSophonContext();

  if (isLoggedIn) {
    return (
      <Stack>
        <Button
          variant="outline"
          leftSection={<DogIcon />}
          onClick={() => setShowSophonAccountProfile(true)}
        >
          {primaryWallet
            ? `Hello, ${shortenAddress(primaryWallet.address)}`
            : "Hello"}
        </Button>
        <SophonUserProfile variant="modal" />
      </Stack>
    );
  }

  return (
    <SophonConnectButtonWidget>
      <Button variant="outline" leftSection={<RabbitIcon />}>
        Connect
      </Button>
    </SophonConnectButtonWidget>
  );
}
