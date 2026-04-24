import { ipcMain } from 'electron'
import { closeOverlayWindow } from './services/shortcut'
import { getSettings, setSettings, testConnection } from './services/settings'
import {
  deleteSummary,
  getAllSummaries,
  getSummaryById,
  retrySummarization,
  starSummary,
  startSummarization,
  startSummarizationFromImage
} from './services/summaries'

const handlers: { [key: string]: (a: any) => any } = {
  // Settings
  setSettings,
  getSettings,
  testConnection,
  // Sumaries
  getAllSummaries,
  getSummaryById,
  startSummarization,
  startSummarizationFromImage,
  retrySummarization,
  deleteSummary,
  starSummary,
  // Overlay
  closeOverlayWindow
}

export function loadHandlers() {
  Object.keys(handlers).forEach((key) => {
    ipcMain.handle(key, (_, data) => handlers[key](data))
  })
}
