import { ipcMain } from "electron";
import { runPrompt } from "./services/llm";

export function loadHandlers() {
  ipcMain.handle("llm:runPrompt", (_, data) => runPrompt(data));
}
