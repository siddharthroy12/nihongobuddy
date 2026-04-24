import { Summary, Settings } from '../../common/types'

declare module '*.css'

export {}

declare global {
  interface Window {
    api: {
      // Settings
      setSettings: (settings: Settings) => void
      getSettings: () => Promise<Settings>
      testConnection: () => Promise<boolean>
      // Summary
      getAllSummaries: () => Promise<Summary[]>
      getSummaryById: (id: string) => Promise<Summary>
      startSummarization: (text: string) => Promise<string>
      startSummarizationFromImage: (image: string) => Promise<string>
      retrySummarization: (id: string) => void
      deleteSummary: (id: string) => void
      starSummary: (id: string) => void
      onSummaryUpdate: (cb: () => void) => void
      // Overloay
      onScreenshot: (cb: (dataUrl: string) => void) => void
      closeOverlayWindow: () => void
    }
  }
}
