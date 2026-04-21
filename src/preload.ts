import { runPrompt } from "./services/llm";

// See the Electron documentation for details on how to use preload scripts:
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runPrompt: (data: string) => ipcRenderer.invoke("llm:runPrompt", data),
});
