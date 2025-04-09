"use client";
import {
  ExampleWithCode,
  SourceLanguage,
} from "@/components/example-with-code";
import { shortenAddress } from "@/lib/formatters";
import { Button, Stack, Title } from "@mantine/core";
import {
  SophonConnectButtonWidget,
  SophonUserProfile,
  useIsLoggedIn,
  useSophonContext,
} from "@sophon-labs/react";
import { DogIcon, RabbitIcon } from "lucide-react";

const ConnectButtonExamplesPage = () => {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet, setShowSophonAccountProfile } = useSophonContext();

  return (
    <>
      <Title order={1} className="pb-10">
        Sophon Connect Button Widget Examples
      </Title>
      <Title order={2}>Button</Title>
      <ExampleWithCode
        code={[
          {
            language: SourceLanguage.TSX,
            fileName: "ButtonWithDropdown.tsx",
            code: `import { SophonWidget } from "@sophon-labs/react";

function Example() {
  return <SophonWidget variant="dropdown" label="Login With Dropdown" />;
}`,
          },
        ]}
      >
        {isLoggedIn ? (
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
        ) : (
          <SophonConnectButtonWidget>
            <Button variant="outline" leftSection={<RabbitIcon />}>
              Connect
            </Button>
          </SophonConnectButtonWidget>
        )}
      </ExampleWithCode>
    </>
  );
};

export default ConnectButtonExamplesPage;
