import * as React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from './components/App.jsx';

const root = createRoot(document.body);
root.render(
  <MantineProvider theme={{ colorScheme: "light" }}>
    <App />
  </MantineProvider>
);
