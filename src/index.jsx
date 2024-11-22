import * as React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./components/App.jsx";

const root = createRoot(document.body);
root.render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{
      colorScheme: "light",
      colors: {
        brand: [
          "#FFE0EB",
          "#FFB8D2",
          "#FF8FB8",
          "#FF679F",
          "#FF3385",
          "#E91E63", // Your main pink color
          "#D81557",
          "#BF134E",
          "#A61144",
          "#8C0F3A",
        ],
        // Adding yellow color palette
        yellow: [
          "#FFF8E1",
          "#FFECB3",
          "#FFE082",
          "#FFD54F",
          "#FFCA28",
          "#FFC107",
          "#FFB300",
          "#FFA000",
          "#FF8F00",
          "#FF6F00",
        ],
      },
      primaryColor: "brand",
    }}
  >
    <App />
  </MantineProvider>
);
