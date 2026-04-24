import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api: any = {}

const handlers = [
  'runPrompt',
  'runPromptWithImage',
  'setSettings',
  'getSettings',
  'setSummaries',
  'getSummaries',
  'registerShortcuts',
  'closeOverlayWindow'
]

handlers.forEach((key) => {
  api[key] = (data: any) => ipcRenderer.invoke(key, data)
})

api.onScreenshot = (cb: (dataUrl: string) => void) =>
  ipcRenderer.on('screenshot-data', (_, dataUrl) => cb(dataUrl))

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
