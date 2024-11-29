// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),
  activateProduct: (data) => ipcRenderer.invoke("activate-product", data),
  checkActivation: () => ipcRenderer.invoke("check-activation"),
  onActivationCheck: (callback) => ipcRenderer.on("check-activation", callback),
});
