// See the Electron documentation for details on how to use preload scripts:
const { contextBridge, ipcRenderer } = require("electron");

const handlers = [
  "runPrompt",
  "setSettings",
  "getSettings",
  "setSummaries",
  "getSummaries",
];
let electronAPI: any = {};

handlers.forEach((key) => {
  electronAPI[key] = (data: any) => ipcRenderer.invoke(key, data);
});
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
