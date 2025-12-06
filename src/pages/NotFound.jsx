import React from "react";
import { Container, Title, Text, Button, Stack, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconHome, IconBook } from "@tabler/icons-react";

const NotFound = () => {
  return (
    <Box
      mih="100vh"
      bg="var(--mantine-color-body)"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--mantine-color-blue-9), var(--mantine-color-indigo-9))",
        padding: "2rem",
      }}
    >
      <Container size="sm" ta="center">
        <Stack align="center" spacing="xl">
          <Title
            order={1}
            fz={{ base: "6rem", sm: "10rem" }}
            fw={900}
            style={{
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            404
          </Title>

          <Title order={2} c="dimmed" fz="xl">
            Oops! Sahifa topilmadi
          </Title>

          <Text c="dimmed" size="lg" maw={500}>
            Siz izlayotgan sahifa mavjud emas, o'chirilgan yoki manzil noto'g'ri kiritilgan bo'lishi mumkin.
          </Text>

          <Stack mt="xl" spacing="md" align="center">
            <Button
              component={Link}
              to="/"
              size="lg"
              leftSection={<IconHome size={22} />}
              color="blue"
              radius="lg"
              style={{ minWidth: 280 }}
            >
              Bosh sahifaga qaytish
            </Button>

            <Button
              component={Link}
              to="/kitoblar"
              size="md"
              variant="light"
              leftSection={<IconBook size={20} />}
              color="indigo"
            >
              Kitoblar katalogiga o'tish
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default NotFound;