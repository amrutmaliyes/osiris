<script>
  import { invoke } from '@tauri-apps/api/tauri'

  async function handleButtonClick() {
    const directory = await invoke('choose_directory')
    console.log('Selected directory:', directory)
    const files = await invoke('list_files_in_dir', { directory })
    console.log('Selected files:', files)
  }
</script>

<button on:click={handleButtonClick}>Choose Directory</button>
