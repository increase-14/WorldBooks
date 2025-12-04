import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import {
  Badge,
  Card,
  Container,
  SimpleGrid,
  Title,
  Text,
  Loader,
  Center,
  Box,
  Image,
  Group,
  Overlay,
  ActionIcon,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

const KitoblarPage = () => {
  const { books, loadBooks, loadingBooks } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (books.length === 0) loadBooks();
  }, []);

  if (loadingBooks) {
    return (
      <Center py="xl" h="80vh">
        <Loader size="xl" color="violet" />
      </Center>
    );
  }

  if (!books || books.length === 0) {
    return (
      <Container py="xl">
        <Title order={2} ta="center" c="dimmed">
          Hozircha kitoblar yo'q
        </Title>
      </Container>
    );
  }

  return (
    <Box py="xl" mih="100vh" bg="var(--mantine-color-body)">
      <Container size="lg">
        <Title order={1} ta="center" mb="xl" fw={800} c="primary">
          Kitoblar ({books.length} ta)
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
          {books.map((book) => (
            <Card
              key={book.id}
              shadow="md"
              radius="lg"
              p={0}
              withBorder
              style={{ overflow: "hidden", cursor: "pointer" }}
              onClick={() => navigate(`/kitoblar/${book.id}`)}
            >
              <Box pos="relative">
                <Image
                  src="https://i.pinimg.com/736x/a0/a8/f3/a0a8f3e594095a44f2071b459c91460c.jpg"
                  height={280}
                  alt={book.name}
                  fit="cover"
                />
                <Overlay gradient="linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%)" />
                <ActionIcon
                  size="lg"
                  radius="xl"
                  color="white"
                  variant="filled"
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    background: "rgba(102, 126, 234, 0.9)",
                  }}
                >
                  <IconArrowRight size={20} />
                </ActionIcon>
              </Box>

              <Box p="lg">
                <Title order={5} lineClamp={2} fw={700}>
                  {book.name}
                </Title>
                {book.author && (
                  <Text size="sm" c="dimmed" mt={4}>
                    {book.author}
                  </Text>
                )}
                {book.library_name && (
                  <Text size="xs" c="dimmed" mt={6}>
                    {book.library_name}
                  </Text>
                )}

                <Group justify="apart" mt="md">
                  {book.year && (
                    <Badge color="grape" variant="light">
                      {book.year}
                    </Badge>
                  )}
                  <Badge
                    color={book.quantity_in_library > 0 ? "teal" : "red"}
                    variant="filled"
                  >
                    {book.quantity_in_library > 0
                      ? `${book.quantity_in_library} ta`
                      : "Mavjud emas"}
                  </Badge>
                </Group>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default KitoblarPage;
