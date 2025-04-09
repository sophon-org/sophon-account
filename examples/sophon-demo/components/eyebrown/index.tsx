import { Text } from "@mantine/core";

export const EyeBrown = ({ label }: { label: string }) => {
  return (
    <Text fw={700} c="gray.6" mt={40} mb={-20}>
      {label}
    </Text>
  );
};
