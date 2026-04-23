import { screen, desktopCapturer } from 'electron'

export async function takeScreenshot(): Promise<string> {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height }
  })
  // Returns base64 PNG data URL
  return sources[0].thumbnail.toDataURL()
}
