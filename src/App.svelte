<script>
  import Login from "./lib/Login.svelte";
  import Activation from "./lib/Activation.svelte";
  import Settings from "./lib/Settings.svelte";
  import Home from "./lib/Home.svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import Router, {push} from "svelte-spa-router";
  import { onMount } from "svelte";

  function goFullScreen() {
      invoke("setFullscreen", { state: true });
  }

  onMount(() => {
      goFullScreen();
  });
  const routes = {
    "/": Home,
    "/login": Login,
    "/activation": Activation,
  };

  // Check if the table exists
  invoke("check_table_exists").then((tableExists) => {
    console.log("tableExists=", tableExists);
    if (!tableExists.activated) {
      push('/activation');
    }
  });
</script>
<Router {routes} />
