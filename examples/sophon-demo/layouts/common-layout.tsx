import { Sidebar } from "@/components/sidebar";
import { Box, Container, Group, ScrollArea } from "@mantine/core";

export const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="flex flex-row h-screen">
      <Sidebar />
      <ScrollArea component="main" className="flex flex-col flex-grow overflow-y-visible">
        <Container size="90%" className="w-full ">
          <Group className="flex flex-col flex-grow w-full !items-start">
            <Box className="flex-grow">{children}</Box>
          </Group>
        </Container>
      </ScrollArea>
    </Box>
  );
};
