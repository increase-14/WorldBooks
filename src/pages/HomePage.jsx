import React, { useEffect, useState } from "react";
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
  Image,
  Group,
  TextInput,
  Button,
  Paper,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const HomePage = () => {
  const { books, loadBooks, loadingBooks } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (books.length === 0) loadBooks();
  }, [loadBooks]);

  const search = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/search/book/?q=${query}`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  const booksToShow = results.length > 0 ? results : books.slice(0, 5);

  return (
    <Box py="xl" mih="100vh" bg="var(--mantine-color-body)">
      <Container size="lg">
        <Title ta="center" mb="xl" c="blue.6" fz="2.5rem" fw={800}>
          Kitoblar katalogi
        </Title>

        <Paper withBorder p="md" radius="lg" mb="xl" shadow="sm">
          <Group>
            <TextInput
              placeholder="Kitob nomi, muallif yoki ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              size="lg"
              style={{ flex: 1 }}
            />
            <Button onClick={search} color="blue" size="lg">
              <IconSearch size={20} />
            </Button>
          </Group>
        </Paper>

        {loadingBooks ? (
          <Center py="xl">
            <Loader size="xl" color="blue" />
          </Center>
        ) : booksToShow.length > 0 ? (
          <>
            <Text ta="center" c="dimmed" mb="lg">
              {results.length > 0
                ? `${results.length} ta topildi`
                : "So'nggi 5 ta kitob"}
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="lg">
              {booksToShow.map((book) => (
                <Card
                  key={book.id}
                  component={Link}
                  to={`/kitoblar/${book.id}`}
                  shadow="sm"
                  radius="lg"
                  withBorder
                  style={{ cursor: "pointer" }}
                  sx={{
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "var(--mantine-shadow-xl)",
                    },
                  }}
                >
                  <Image
                    src="https://i.pinimg.com/736x/a0/a8/f3/a0a8f3e594095a44f2071b459c91460c.jpg"
                    height={220}
                    fit="cover"
                    radius="lg lg 0 0"
                  />
                  <Box p="md">
                    <Title order={6} lineClamp={2} fw={600}>
                      {book.name}
                    </Title>
                    {book.author && (
                      <Text size="sm" c="dimmed" mt={4} lineClamp={1}>
                        {book.author}
                      </Text>
                    )}
                    <Group justify="apart" mt="md">
                      {book.year && (
                        <Badge color="blue" variant="light">
                          {book.year}
                        </Badge>
                      )}
                      <Badge
                        color={book.quantity_in_library > 0 ? "teal" : "red"}
                        variant={
                          book.quantity_in_library > 0 ? "filled" : "outline"
                        }
                      >
                        {book.quantity_in_library || 0} ta
                      </Badge>
                    </Group>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>

            {results.length === 0 && books.length > 5 && (
              <Center mt="xl">
                <Button component={Link} to="/kitoblar" color="blue" size="lg">
                  Barcha kitoblar ({books.length} ta)
                </Button>
              </Center>
            )}
          </>
        ) : (
          <Text ta="center" c="dimmed" size="lg" py="xl">
            Kitoblar topilmadi
          </Text>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
