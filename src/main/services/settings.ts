import { Settings } from '../../common/types'
import { runPrompt } from './llm'
import { registerShortcuts } from './shortcut'
import { settingsStore } from './store'

let defaultSettings: Settings = {
  llm: {
    llmApiKey: '',
    llmBaseUrl: '',
    llmModel: ''
  },
  shortcut: {
    quicksummary: ''
  }
}

if (!settingsStore.get()) {
  settingsStore.set(JSON.stringify(defaultSettings))
}

export function getSettings(): Settings {
  return JSON.parse(settingsStore.get())
}

export function setSettings(settings: Settings) {
  settingsStore.set(JSON.stringify(settings))
  registerShortcuts()
}

export async function testConnection(): Promise<boolean> {
  try {
    const res = await runPrompt('Hello')
    if (res) {
      return true
    }
  } catch {}

  return false
}
