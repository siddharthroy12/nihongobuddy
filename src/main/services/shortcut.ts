import { BrowserWindow, globalShortcut, screen } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { takeScreenshot } from './screenshot'
import { getSettings } from './settings'

let overlayWindow: BrowserWindow | null = null

export function closeOverlayWindow() {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.close()
  }
}

function openOverlayWindow(screenshotDataUrl: string) {
  closeOverlayWindow()
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize
  const windowWidth = 250
  const windowHeight = 250

  overlayWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: screenWidth - windowWidth, // Align to right edge
    y: 0, // Align to top edge
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    overlayWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/overlay')
  } else {
    overlayWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/overlay' // <-- key part for prod
    })
  }

  overlayWindow.webContents.once('did-finish-load', () => {
    overlayWindow?.webContents.send('onScreenshot', screenshotDataUrl)
  })
}

async function quickSummaryShortcut() {
  const screenshot = await takeScreenshot()
  openOverlayWindow(screenshot)
}

export function registerShortcuts() {
  globalShortcut.unregisterAll()

  const s = getSettings()

  if (s.shortcut.quicksummary) {
    try {
      globalShortcut.register(s.shortcut.quicksummary, async () => {
        quickSummaryShortcut()
      })
    } catch {}
  }
}
