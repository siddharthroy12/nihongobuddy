import { ipcMain } from "electron";
import { runPrompt } from "./services/llm";
import { settings, summaries } from "./services/store";

const handlers: { [key: string]: (a: any) => any } = {
  runPrompt: runPrompt,
  setSettings: settings.set,
  getSettings: settings.get,
  setSummaries: summaries.set,
  getSummaries: summaries.get,
};

export function loadHandlers() {
  Object.keys(handlers).forEach((key) => {
    ipcMain.handle(key, (_, data) => handlers[key](data));
  });
}
