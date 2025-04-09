import { Group, Text } from "@mantine/core";
import Image from "next/image";

export function Logo() {
  return (
    <Group>
      <Image
        src="/img/logo-black.svg"
        alt="Sophon Logo"
        width={54}
        height={24}
      />
      <Text ml={-12}>
        Sophon{" "}
        <Text span c="dimmed" size="sm">
          &lt;dev /&gt;
        </Text>
      </Text>
    </Group>
  );
}
