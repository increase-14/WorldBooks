import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Badge,
  Button,
  Card,
  Loader,
  Center,
  Stack,
  Group,
  Image,
  Box,
  Overlay,
  ActionIcon,
} from "@mantine/core";
import { IconArrowLeft, IconBook2 } from "@tabler/icons-react";

const KitoblarDetail = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${id}/`
        );
        if (!response.ok) throw new Error("Kitob topilmadi");
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading)
    return (
      <Center h="80vh">
        <Loader size="xl" color="indigo" />
      </Center>
    );

  if (!book) {
    return (
      <Container py="xl">
        <Title ta="center" c="red" order={2}>
          Kitob topilmadi (ID: {id})
        </Title>
        <Center mt="lg">
          <Button
            component={Link}
            to="/kitoblar"
            leftSection={<IconArrowLeft />}
          >
            Orqaga
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Box py="xl" mih="100vh" bg="var(--mantine-color-body)">
      <Container size="lg">
        <Button
          component={Link}
          to="/kitoblar"
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={20} />}
          mb="xl"
        >
          Barcha kitoblar
        </Button>

        <Card
          shadow="xl"
          radius="xl"
          p={0}
          withBorder
          style={{ overflow: "hidden" }}
        >
          <Group align="start" gap={0}>
            <Box pos="relative" w={{ base: "100%", md: 380 }} h={520}>
              <Image
                src="https://i.pinimg.com/736x/a0/a8/f3/a0a8f3e594095a44f2071b459c91460c.jpg"
                alt={book.title || "Kitob"}
                fit="cover"
                height="100%"
                radius="xl 0 0 xl"
              />
              <Overlay
                gradient="linear-gradient(45deg, rgba(0,0,0,0.8), transparent 50%)"
                opacity={0.6}
              />
              <ActionIcon
                size={70}
                radius="xl"
                color="white"
                variant="filled"
                style={{
                  position: "absolute",
                  bottom: 24,
                  right: 24,
                  background: "rgba(79, 70, 229, 0.9)",
                }}
              >
                <IconBook2 size={36} />
              </ActionIcon>
            </Box>

            <Stack p="xl" spacing="xl" style={{ flex: 1 }}>
              <Title order={1} fw={800} c="primary">
                {book.name}
              </Title>

              <Stack spacing="md">
                {book.author && (
                  <Text size="xl" fw={600}>
                    Muallif:{" "}
                    <span style={{ color: "var(--mantine-color-blue-6)" }}>
                      {book.author}
                    </span>
                  </Text>
                )}
                {book.library_name && (
                  <Text size="lg">
                    Kutubxona: <strong>{book.library_name}</strong>
                  </Text>
                )}
                {book.publisher && (
                  <Text size="lg" c="dimmed">
                    Nashriyot: {book.publisher}
                  </Text>
                )}
              </Stack>

              <Group gap="lg" mt="lg">
                {book.year && (
                  <Badge size="xl" color="violet">
                    {book.year}
                  </Badge>
                )}
                {book.isbn && (
                  <Badge size="xl" color="indigo" variant="outline">
                    ISBN: {book.isbn}
                  </Badge>
                )}
                <Badge
                  size="xl"
                  color={book.quantity_in_library > 0 ? "teal" : "red"}
                  variant="filled"
                >
                  {book.quantity_in_library > 0
                    ? `${book.quantity_in_library} ta mavjud`
                    : "Mavjud emas"}
                </Badge>
              </Group>
            </Stack>
          </Group>
        </Card>
      </Container>
    </Box>
  );
};

export default KitoblarDetail;
