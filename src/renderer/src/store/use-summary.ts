import { create } from 'zustand'
import { generateSummary, generateSummaryFromImage } from '../services/summarize'
import { Summary } from '../types'

export type SummaryState = {
  summaries: Summary[]
}

export type SummaryActions = {
  startSummarization: (text: string, onStart?: (id: string) => void) => Promise<Summary | undefined>
  startSummarizationFromImage: (
    text: string,
    onStart?: (id: string) => void
  ) => Promise<Summary | undefined>
  retrySummarization: (id: string) => Promise<Summary | undefined>
  getSummary: (id: string) => Summary | undefined
  updateSummary: (id: string, summary: Partial<Summary>) => void
  saveSummaries: () => void
  loadSummaries: () => void
  deleteSummary: (id: string) => void
  starSummary: (id: string) => void
}

const defaultState: SummaryState = {
  summaries: []
}

export const useSummary = create<SummaryState & SummaryActions>()((set, get) => ({
  ...defaultState,
  getSummary(id: string) {
    return get().summaries.find((s) => s.id === id)
  },
  updateSummary(id, newProps) {
    set((state) => ({
      summaries: state.summaries.map((s) => (s.id === id ? { ...s, ...newProps } : s))
    }))
  },
  deleteSummary(id) {
    set((state) => ({
      summaries: state.summaries.filter((s) => s.id !== id)
    }))
    get().saveSummaries()
  },
  starSummary(id) {
    set((state) => ({
      summaries: state.summaries.map((s) => (s.id === id ? { ...s, starred: !s.starred } : s))
    }))
    get().saveSummaries()
  },
  async retrySummarization(id) {
    const summary = get().summaries.find((s) => s.id === id)
    if (!summary || summary.processing) return

    get().updateSummary(id, { processing: true, error: '', sentences: [] })
    try {
      let result: any
      if (summary.promptImageUrl) {
        result = await generateSummaryFromImage(summary.promptImageUrl)
      } else {
        result = await generateSummary(summary.promptText)
      }
      get().updateSummary(id, {
        processing: false,
        sentences: result?.sentences ?? []
      })
      get().saveSummaries()
    } catch (e) {
      get().updateSummary(id, {
        processing: false,
        error: e + ''
      })
      throw e
    }

    return get().getSummary(id)
  },
  async startSummarizationFromImage(image, onStart) {
    const newSummary: Summary = {
      id: crypto.randomUUID(),
      promptText: 'Image',
      promptImageUrl: image,
      processing: true,
      error: '',
      sentences: [],
      starred: false
    }
    if (onStart) {
      onStart(newSummary.id)
    }
    set((state) => ({
      summaries: [...state.summaries, newSummary]
    }))
    try {
      const summary = await generateSummaryFromImage(image)
      get().updateSummary(newSummary.id, {
        processing: false,
        sentences: summary?.sentences ?? []
      })
      get().saveSummaries()
    } catch (e) {
      get().updateSummary(newSummary.id, {
        processing: false,
        error: e + ''
      })
      throw e
    }
    return get().getSummary(newSummary.id)
  },
  async startSummarization(text, onStart) {
    const newSummary: Summary = {
      id: crypto.randomUUID(),
      promptText: text,
      promptImageUrl: '',
      processing: true,
      error: '',
      sentences: [],
      starred: false
    }
    if (onStart) {
      onStart(newSummary.id)
    }
    set((state) => ({
      summaries: [...state.summaries, newSummary]
    }))
    try {
      const summary = await generateSummary(text)
      get().updateSummary(newSummary.id, {
        processing: false,
        sentences: summary?.sentences ?? []
      })
      get().saveSummaries()
    } catch (e) {
      get().updateSummary(newSummary.id, {
        processing: false,
        error: e + ''
      })
      throw e
    }
    return get().getSummary(newSummary.id)
  },
  async saveSummaries() {
    // We don't process thing in background so as soon as the app is closed the processing stops
    const copy = get()
    copy.summaries.forEach((summmary) => {
      summmary.processing = false
    })
    //@ts-ignore
    await window.api.setSummaries(JSON.stringify(copy))
  },
  async loadSummaries() {
    const summaries = JSON.parse(
      // @ts-ignore
      (await window.api.getSummaries()) ?? JSON.stringify(defaultState)
    )
    set({
      ...summaries
    })
  }
}))

useSummary.getState().loadSummaries()
