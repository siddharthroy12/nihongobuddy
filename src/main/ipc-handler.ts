import { ipcMain } from 'electron'
import { runPrompt, runPromptWithImage } from './services/llm'
import { settings, summaries } from './services/store'
import { closeOverlayWindow, registerShortcuts } from './services/shortcut'

const handlers: { [key: string]: (a: any) => any } = {
  runPrompt: runPrompt,
  runPromptWithImage,
  setSettings: settings.set,
  getSettings: settings.get,
  setSummaries: summaries.set,
  getSummaries: summaries.get,
  registerShortcuts: registerShortcuts,
  closeOverlayWindow: closeOverlayWindow
}

export function loadHandlers() {
  Object.keys(handlers).forEach((key) => {
    ipcMain.handle(key, (_, data) => handlers[key](data))
  })
}
