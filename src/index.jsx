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
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728", // Your main pink color
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
        ],
        // Adding yellow color palette
        yellow: [
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
          "#E78728",
        ],
      },
      primaryColor: "brand",
    }}
  >
    <App />
  </MantineProvider>
);
