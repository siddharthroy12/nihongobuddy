import { createWorker } from 'tesseract.js'

export async function extractTextFromImage(url: string | File): Promise<string> {
  const worker = await createWorker('jpn')
  const ret = await worker.recognize(url)
  return ret.data.text
}
