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
          "#E91E63",
          "#D81557",
          "#BF134E",
          "#A61144",
          "#8C0F3A",
        ],
        orange: [
          "#FFF3E0",
          "#FFE0B2",
          "#FFCC80",
          "#FFB74D",
          "#FFA726",
          "#E78728",
          "#D67321",
          "#C46A1B",
          "#B36215",
          "#A1580F",
        ],
      },
      primaryColor: "orange",
      components: {
        Button: {
          defaultProps: {
            color: "orange",
          },
        },
      },
    }}
  >
    <div style={{ backgroundColor: "#172c35", minHeight: "100vh" }}>
      <App />
    </div>
  </MantineProvider>
);
