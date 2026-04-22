import { create } from 'zustand'
import { generateSummary } from '../services/summarize'
import { Summary } from '../types'

export type SummaryState = {
  summaries: Summary[]
}

export type SummaryActions = {
  startSummarization: (text: string) => Summary
  updateSummary: (id: string, summary: Partial<Summary>) => void
  saveSummaries: () => void
  loadSummaries: () => void
}

export const useSummary = create<SummaryState & SummaryActions>()((set, get) => ({
  summaries: [],
  updateSummary(id, newProps) {
    set((state) => ({
      summaries: state.summaries.map((s) => (s.id === id ? { ...s, ...newProps } : s))
    }))
  },
  startSummarization(text) {
    const newSummary: Summary = {
      id: crypto.randomUUID(),
      promptText: text,
      promptImageUrl: '',
      processing: true,
      error: '',
      sentences: []
    }
    set((state) => ({
      summaries: [...state.summaries, newSummary]
    }))
    ;(async () => {
      try {
        const summary = await generateSummary(text)
        get().updateSummary(newSummary.id, {
          processing: false,
          sentences: summary.sentences
        })
        get().saveSummaries()
      } catch (e) {
        get().updateSummary(newSummary.id, {
          processing: false,
          error: e + ''
        })
        throw e
      }
    })()
    return newSummary
  },
  async saveSummaries() {
    //@ts-ignore
    await window.api.setSummaries(JSON.stringify(get()))
  },
  async loadSummaries() {
    const summaries = JSON.parse(
      // @ts-ignore
      (await window.api.getSummaries()) ?? '{}'
    )
    console.log(summaries)
    set({
      ...summaries
    })
  }
}))

useSummary.getState().loadSummaries()
