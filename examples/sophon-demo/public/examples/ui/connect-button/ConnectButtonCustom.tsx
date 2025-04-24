"use client";

import { Button, Stack } from "@mantine/core";
import {
  shortenAddress,
  SophonConnectButtonWidget,
  SophonUserProfile,
  useIsLoggedIn,
  useSophonContext,
} from "@sophon-labs/react";
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
          Hello, {shortenAddress(primaryWallet!.address)}
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
