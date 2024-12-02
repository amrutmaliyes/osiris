// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),
  activateProduct: (data) => ipcRenderer.invoke("activate-product", data),
  checkActivation: () => ipcRenderer.invoke("check-activation"),
  onActivationCheck: (callback) => ipcRenderer.on("check-activation", callback),
  getActivationCredentials: () => ipcRenderer.invoke('get-activation-credentials'),
  getUserCredentials: () => ipcRenderer.invoke('get-user-credentials'),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  addContentPath: (path) => ipcRenderer.invoke("add-content-path", path),
  getContentPaths: () => ipcRenderer.invoke("get-content-paths"),
  setActiveContent: (contentId) => ipcRenderer.invoke("set-active-content", contentId),
  deleteContentPath: (contentId) => ipcRenderer.invoke("delete-content-path", contentId),
  readDirectory: (path) => ipcRenderer.invoke("readDirectory", path),
  openFile: (path) => ipcRenderer.invoke("openFile", path),
  handleFileError: (error) => ipcRenderer.invoke("handleFileError", error),
  openWithDefaultApp: (path) => ipcRenderer.invoke("openWithDefaultApp", path)
});
