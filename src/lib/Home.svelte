<script>
  import Footer from "./components/Footer.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";

  let files;
  let currentDirectory;
  async function goFullScreen() {
    const directory = await invoke("choose_directory");
    currentDirectory = directory;
    console.log("Selected directory:", directory);
    const getFiles = await invoke("list_files_in_dir", { directory });
    console.log("Selected files:", getFiles);
    files = getFiles;
  }

  async function getFolders(folderName){
    console.log("folderName directory:", currentDirectory, folderName);
    let directory = currentDirectory+'/'+folderName;
    const getFiles = await invoke("list_files_in_dir", { directory });
    console.log("Selected files:", getFiles);
    files = getFiles;
  }

  onMount(() => {
      goFullScreen();
  });

</script>

<main>
  <div class="container-scroller">
    <Navbar />

    <div class="container-fluid page-body-wrapper">
      <Sidebar />

      <div class="main-panel">
        <div class="home-content-wrapper">
          <div class="row">
            {#if files}
              {#each files as file}
                <div class="col-md-3 grid-margin stretch-card mb-3" on:click={() => getFolders(file)}>
                  <div class="home-card">
                    <div class="card-body">
                      <div class="aligner-wrapper">
                        <img src="/folder.png" class="logo-dark" alt="" srcset="" />
                        <span
                          class="d-block text-center text-dark text-overflow-2 font-weight-semibold mb-0"
                          >{file}</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <p>Loading...</p>
            {/if}
          </div>          
        </div>
        <!--Footer Section-->
        <Footer />
      </div>
    </div>
  </div>
</main>
