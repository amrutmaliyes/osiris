/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 */

import "./index.css";
import "./index.jsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Initialize any renderer-specific code here
console.log("👋 Renderer process initialized");

// Error handling for uncaught exceptions
window.addEventListener("error", (event) => {
  console.error("Uncaught error:", event.error);
});

// Error handling for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
