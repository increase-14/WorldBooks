import React from "react";
import { Container, Text, Group, Divider } from "@mantine/core";

const Footer = () => {
  return (
    <Container size="xl" py="xl" mt="xl">
      <Divider my="xl" />

      <Group justify="center" gap="md">
        <Text size="sm" c="dimmed">
          © 2025 Kitoblar Katalogi
        </Text>
        <Text size="sm" c="dimmed">•</Text>
        <Text size="sm" c="dimmed">
          Kitobsevarlar uchun yaratilgan
        </Text>
      </Group>
    </Container>
  );
};

export default Footer;