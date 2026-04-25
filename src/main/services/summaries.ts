import { BrowserWindow } from 'electron'
import { Summary } from '../../common/types'
import { generateSummary, generateSummaryFromImage } from './prompts'
import { summariesStore } from './store'

let summaries: {
  summaries: Summary[]
} = {
  summaries: []
}

if (!summariesStore.get()) {
  saveSummaries()
} else {
  summaries = JSON.parse(summariesStore.get())
}

function saveSummaries() {
  const copy: typeof summaries = JSON.parse(JSON.stringify(summaries))
  copy.summaries.forEach((summary) => {
    summary.processing = false // I do this because if the program is closed then the processing is also stopped
  })
  summariesStore.set(JSON.stringify(copy))
  notifyWindows()
}

function notifyWindows() {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('onSummaryUpdate')
  })
}

function updateSummary(id: string, newProps: Partial<Summary>) {
  const summary = summaries.summaries.find((summary) => summary.id === id)
  if (summary) {
    Object.keys(newProps).forEach((key) => {
      summary[key] = newProps[key]
    })
  }
  notifyWindows()
}

export function getAllSummaries(): Summary[] {
  return summaries.summaries.toReversed()
}

export function getSummaryById(id: string): Summary | undefined {
  const summary = summaries.summaries.find((summary) => summary.id === id)
  return summary
}

export function startSummarization(text): string {
  const newSummary: Summary = {
    id: crypto.randomUUID(),
    promptText: text,
    promptImageUrl: '',
    processing: true,
    error: '',
    sentences: [],
    starred: false
  }
  summaries.summaries = [...summaries.summaries, newSummary]
  saveSummaries()
  async function process() {
    try {
      const summary = await generateSummary(text)

      updateSummary(newSummary.id, {
        processing: false,
        sentences: summary?.sentences ?? []
      })
      saveSummaries()
    } catch (e) {
      updateSummary(newSummary.id, {
        processing: false,
        error: e + ''
      })
    }
  }
  process()
  return newSummary.id
}

export function startSummarizationFromImage(image): string {
  const newSummary: Summary = {
    id: crypto.randomUUID(),
    promptText: 'Image',
    promptImageUrl: image,
    processing: true,
    error: '',
    sentences: [],
    starred: false
  }
  summaries.summaries = [...summaries.summaries, newSummary]
  saveSummaries()
  async function process() {
    try {
      const summary = await generateSummaryFromImage(image)

      updateSummary(newSummary.id, {
        processing: false,
        sentences: summary?.sentences ?? []
      })
      saveSummaries()
    } catch (e) {
      updateSummary(newSummary.id, {
        processing: false,
        error: e + ''
      })
    }
  }
  process()
  return newSummary.id
}

export async function retrySummarization(id: string) {
  const summary = getSummaryById(id)
  if (!summary || summary.processing) return
  console.log('retrying')
  updateSummary(id, { processing: true, error: '', sentences: [] })
  try {
    let result: any
    if (summary.promptImageUrl) {
      result = await generateSummaryFromImage(summary.promptImageUrl)
    } else {
      result = await generateSummary(summary.promptText)
    }
    updateSummary(id, {
      processing: false,
      sentences: result?.sentences ?? []
    })
    saveSummaries()
  } catch (e) {
    updateSummary(id, {
      processing: false,
      error: e + ''
    })
  }
}

export async function deleteSummary(id: string) {
  summaries.summaries = summaries.summaries.filter((s) => s.id !== id)
  saveSummaries()
}

export async function starSummary(id: string) {
  const summary = getSummaryById(id)
  if (summary) {
    summary.starred = !summary.starred
  }
  saveSummaries()
}
