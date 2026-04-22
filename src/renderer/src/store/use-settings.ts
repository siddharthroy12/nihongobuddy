import { create } from 'zustand'
import { Settings } from '../types'

type SettingsState = Settings

type SettingsActions = {
  saveSettings: () => void
  loadSettings: () => void
}

export const useSettings = create<SettingsState & SettingsActions>()((set, get) => ({
  llm: {
    llmApiKey: '',
    llmBaseUrl: '',
    llmModel: ''
  },
  async saveSettings() {
    const json = JSON.stringify(get())
    // @ts-ignore
    window.api.setSettings(json)
  },
  async loadSettings() {
    // @ts-ignore
    const settings = JSON.parse(
      // @ts-ignore
      (await window.api.getSettings()) ?? '{}'
    )
    set({
      llm: {
        llmApiKey: settings?.llm?.llmApiKey,
        llmBaseUrl: settings?.llm?.llmBaseUrl,
        llmModel: settings?.llm?.llmModel
      }
    })
  }
}))

useSettings.getState().loadSettings()
