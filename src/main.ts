import "./styles.css";
import App from "./App.svelte";
declare global {
  interface Window {
    tauri: {
      promisified: {
        openDialog: () => Promise<File[]>;
      };
    };
  }
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
