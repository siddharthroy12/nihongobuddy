import { create } from 'zustand'
import { Settings } from '../types'

type SettingsState = Settings

type SettingsActions = {
  saveSettings: () => void
  loadSettings: () => void
}

const defaultState: Settings = {
  llm: {
    llmApiKey: '',
    llmBaseUrl: '',
    llmModel: ''
  },
  shortcut: {
    quicksummary: ''
  }
}

export const useSettings = create<SettingsState & SettingsActions>()((set, get) => ({
  ...defaultState,
  async saveSettings() {
    const json = JSON.stringify(get())
    // @ts-ignore
    window.api.setSettings(json)
    // @ts-ignore
    window.api.registerShortcuts()
  },
  async loadSettings() {
    // @ts-ignore
    const settings = JSON.parse(
      // @ts-ignore
      (await window.api.getSettings()) ?? JSON.stringify(defaultState)
    )
    set({
      ...settings
    })
  }
}))

useSettings.getState().loadSettings()
