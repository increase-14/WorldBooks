import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Box,
  Image,
  Button,
  Group,
  Card,
  SimpleGrid,
  Badge,
  Stack,
} from "@mantine/core";
import { IconArrowLeft, IconMapPin, IconBooks } from "@tabler/icons-react";

const KutubxonalarDetail = () => {
  const { id } = useParams();
  const currentLibrary = useAppStore((state) => state.currentLibrary);
  const currentLibraryBooks = useAppStore(
    (state) => state.currentLibraryBooks || []
  );
  const loadingLibraryDetail = useAppStore(
    (state) => state.loadingLibraryDetail
  );
  const loadLibraryDetail = useAppStore((state) => state.loadLibraryDetail);
  const error = useAppStore((state) => state.error);

  useEffect(() => {
    if (id) loadLibraryDetail(id);
  }, [id, loadLibraryDetail]);

  if (loadingLibraryDetail) {
    return (
      <Center h="70vh">
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

  if (error || !currentLibrary) {
    return (
      <Container py="xl" ta="center">
        <Title c="red">Kutubxona topilmadi</Title>
        <Text c="dimmed" mt="md">
          ID: {id}
        </Text>
        <Button
          mt="lg"
          component={Link}
          to="/kutubxonalar"
          leftSection={<IconArrowLeft />}
        >
          Orqaga
        </Button>
      </Container>
    );
  }

  return (
    <Box py="xl" mih="100vh" bg="var(--mantine-color-body)">
      <Container size="lg">
        <Button
          component={Link}
          to="/kutubxonalar"
          variant="subtle"
          leftSection={<IconArrowLeft />}
          mb="xl"
        >
          Orqaga
        </Button>

        <Card shadow="sm" radius="lg" withBorder p="xl" mb="xl">
          <Group align="start" gap="xl">
            <Image
              src="https://i.pinimg.com/736x/a0/a8/f3/a0a8f3e594095a44f2071b459c91460c.jpg"
              width={220}
              height={220}
              radius="lg"
              fit="cover"
            />
            <Stack gap="md">
              <Title order={2} fw={900} c="primary">
                {currentLibrary.name}
              </Title>
              <Text size="lg" c="dimmed">
                {currentLibrary.address}
              </Text>

              <Group gap="xl" mt="lg">
                <Group align="center" gap="sm">
                  <IconBooks size={28} color="#3b82f6" />
                  <Text size="xl" fw={700}>
                    {currentLibrary.total_books || 0} ta kitob
                  </Text>
                </Group>
                <Group align="center" gap="sm">
                  <IconMapPin
                    size={28}
                    color={currentLibrary.latitude ? "#10b981" : "#f97316"}
                  />
                  <Text
                    size="lg"
                    c={currentLibrary.latitude ? "teal" : "orange"}
                    fw={600}
                  >
                    {currentLibrary.latitude
                      ? "Xaritada bor"
                      : "Koordinata yo'q"}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Group>
        </Card>

        <Title order={2} mb="lg" c="blue.6">
          Mavjud kitoblar ({currentLibraryBooks.length} ta)
        </Title>

        {currentLibraryBooks.length === 0 ? (
          <Card shadow="sm" radius="lg" withBorder p="xl">
            <Text ta="center" c="dimmed" size="lg" py="xl">
              Bu kutubxonada hali kitoblar qo'shilmagan
            </Text>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
            {currentLibraryBooks.map((book) => (
              <Card
                key={book.id}
                component={Link}
                to={`/kitoblar/${book.id}`}
                shadow="sm"
                radius="lg"
                withBorder
                p="md"
                style={{ cursor: "pointer" }}
              >
                <Image
                  src="https://i.pinimg.com/736x/a0/a8/f3/a0a8f3e594095a44f2071b459c91460c.jpg"
                  height={180}
                  fit="cover"
                  radius="md"
                  mb="md"
                />
                <Stack gap="xs">
                  <Text fw={700} size="sm" lineClamp={2}>
                    {book.title || "Nomsiz kitob"}
                  </Text>
                  {book.author && (
                    <Text size="xs" c="dimmed">
                      {book.author}
                    </Text>
                  )}
                  <Group justify="apart" mt="auto">
                    {book.year && <Badge size="xs">{book.year}</Badge>}
                    <Badge
                      color={book.quantity_in_library > 0 ? "teal" : "red"}
                      variant="filled"
                    >
                      {book.quantity_in_library || 0} ta
                    </Badge>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default KutubxonalarDetail;
