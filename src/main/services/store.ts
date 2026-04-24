import Store from 'electron-store'

const KEYS = {
  SETTINGS: 'SETTINGS',
  SUMMARIES: 'SUMMARIES'
} as const

const store = new Store()

type StoreKey = keyof typeof KEYS

function createAccessors(key: StoreKey) {
  return {
    get: () => store.get(KEYS[key]) as any,
    set: (value: any) => store.set(KEYS[key], value)
  }
}

export const settingsStore = createAccessors(KEYS.SETTINGS)
export const summariesStore = createAccessors(KEYS.SUMMARIES)
