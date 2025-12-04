import React from "react";
import {
  Container,
  Group,
  Text,
  Box,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Menu,
} from "@mantine/core";
import { IconSun, IconMoon, IconWorld } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const location = useLocation();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/kitoblar", label: t("nav.books") },
    { to: "/kutubxonalar", label: t("nav.libraries") },
  ];

  const languageOptions = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <Box
      component="nav"
      py="lg"
      style={{
        backgroundColor: "var(--mantine-color-body)",
        borderBottom: "1px solid var(--mantine-color-default-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      <Container size="xl">
        <Group justify="space-between" align="center">
          <Group justify="center" gap={100}>
            {links.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <RouterNavLink
                  key={link.to}
                  to={link.to}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    pos="relative"
                    py="md"
                    px="lg"
                    style={{
                      cursor: "pointer",
                      borderRadius: "var(--mantine-radius-md)",
                      transition: "all 0.3s ease",
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--mantine-color-default-hover)",
                      },
                    }}
                  >
                    <Text
                      size="xl"
                      fw={isActive ? 800 : 500}
                      c={isActive ? "indigo.5" : "dimmed"}
                      style={{
                        letterSpacing: "0.8px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {link.label}
                    </Text>

                    <Box
                      style={{
                        position: "absolute",
                        bottom: 8,
                        left: "10%",
                        right: "10%",
                        height: 4,
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                        borderRadius: 4,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "center",
                        transition:
                          "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                        opacity: isActive ? 1 : 0,
                      }}
                    />

                    {isActive && (
                      <Box
                        style={{
                          position: "absolute",
                          top: -14,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <Box
                          w={10}
                          h={10}
                          bg="indigo.5"
                          style={{
                            borderRadius: "50%",
                            boxShadow: "0 0 15px var(--mantine-color-indigo-5)",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </RouterNavLink>
              );
            })}
          </Group>

          <Group>
            <ActionIcon
              onClick={toggleColorScheme}
              size="lg"
              variant="subtle"
              color={computedColorScheme === "dark" ? "yellow" : "dark"}
            >
              {computedColorScheme === "dark" ? (
                <IconSun size={22} stroke={1.5} />
              ) : (
                <IconMoon size={22} stroke={1.5} />
              )}
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon size="lg" variant="subtle">
                  <IconWorld size={22} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Til</Menu.Label>
                {languageOptions.map((lang) => (
                  <Menu.Item
                    key={lang.code}
                    leftSection={<Text span>{lang.flag}</Text>}
                    onClick={() => changeLanguage(lang.code)}
                    style={{
                      fontWeight:
                        i18n.language === lang.code ? "bold" : "normal",
                    }}
                  >
                    {lang.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Nav;
