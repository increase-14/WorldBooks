import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import {
  Container,
  Title,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Loader,
  Center,
  Box,
  Group,
} from "@mantine/core";
import { IconMapPin, IconBuilding, IconBooks } from "@tabler/icons-react";

const KutubxonalarPage = () => {
  const { libraries, loadLibraries, loadingLibraries } = useAppStore();

  useEffect(() => {
    if (libraries.length === 0) loadLibraries();
  }, []);

  if (loadingLibraries) {
    return (
      <Center h="70vh">
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

  return (
    <Box py="xl" mih="100vh" bg="var(--mantine-color-body)">
      <Container size="lg">
        <Title ta="center" mb="xl" c="blue.6" fz="2.5rem" fw={800}>
          Kutubxonalar ({libraries.length} ta)
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {libraries.map((lib) => (
            <Card
              key={lib.id}
              component={Link}
              to={`/kutubxonalar/${lib.id}`}
              shadow="sm"
              radius="lg"
              p="lg"
              withBorder
              style={{ cursor: "pointer" }}
            >
              <Group justify="apart" mb="md">
                <IconBuilding size={28} color="#2563eb" />
                {lib.latitude && lib.longitude ? (
                  <Badge color="teal" variant="light">
                    Xaritada bor
                  </Badge>
                ) : (
                  <Badge color="orange" variant="light">
                    {lib.address}
                  </Badge>
                )}
              </Group>

              <Title order={4} fw={700}>
                {lib.name || "Nomsiz kutubxona"}
              </Title>

              <Text size="sm" c="dimmed" mt={6}>
                {lib.address || "Manzil ko'rsatilmagan"}
              </Text>

              <Group mt="md" gap="xs" align="center">
                <IconBooks size={20} color="#3b82f6" />
                <Text size="sm" fw={600} c="blue.6">
                  {lib.total_books || 0} ta kitob
                </Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default KutubxonalarPage;
