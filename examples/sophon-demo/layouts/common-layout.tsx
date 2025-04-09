import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Box, Container, Group } from "@mantine/core";

export const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="flex flex-row h-screen">
      <Sidebar />
      <Box component="main" className="flex flex-col flex-grow">
        <Container size="90%" className="w-full ">
          <Group className="flex flex-col flex-grow w-full !items-start">
            <Box className="flex-grow">{children}</Box>
          </Group>
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};
