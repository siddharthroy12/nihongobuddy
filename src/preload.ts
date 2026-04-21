// See the Electron documentation for details on how to use preload scripts:

import { ipcRenderer } from "electron/renderer";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
ipcRenderer.on("theme-changed", (_, isDark) => {
  console.log({ isDark });
  document.documentElement.classList.toggle("dark", isDark);
});
