import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api: any = {
  // Allow platform simulation for testing: SIMULATE_PLATFORM=win32 npm run dev
  platform: process.env['SIMULATE_PLATFORM'] ?? process.platform
}

const handlers = [
  // Settings
  'setSettings',
  'getSettings',
  'testConnection',
  // Sumaries
  'getAllSummaries',
  'getSummaryById',
  'startSummarization',
  'startSummarizationFromImage',
  'retrySummarization',
  'deleteSummary',
  'starSummary',
  // Overlay
  'closeOverlayWindow'
]

handlers.forEach((key) => {
  api[key] = (data: any) => ipcRenderer.invoke(key, data)
})

const callbacks = ['onScreenshot', 'onSummaryUpdate']

callbacks.forEach((key) => {
  api[key] = (cb: (payload: any) => void) => ipcRenderer.on(key, (_, data) => cb(data))
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
