import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { BrowserRouter } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./i18n";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const theme = createTheme();
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <App />

        <ToastContainer position="top-right" />

        <Notifications position="top-right" />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
);
