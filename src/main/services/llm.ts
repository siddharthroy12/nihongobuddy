import OpenAI from 'openai'
import { getSettings } from './settings'

export async function runPrompt(prompt: string): Promise<string | null> {
  const settingsData = getSettings()
  const client = new OpenAI({
    baseURL: settingsData?.['llm']?.['llmBaseUrl'] ?? '', // your local LLM's URL
    apiKey: settingsData?.['llm']?.['llmApiKey'] ?? '' // most local servers don't check this
  })
  try {
    const response = await client.chat.completions.create({
      model: settingsData?.['llm']?.['llmModel'],
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: prompt
        }
      ]
    })
    return response.choices[0].message.content
  } catch (e) {
    console.error(e)
  }
  return null
}

export async function runPromptWithImage(
  prompt: string,
  imageBase64: string
): Promise<string | null> {
  const settingsData = getSettings()
  console.log(settingsData)
  const client = new OpenAI({
    baseURL: settingsData?.['llm']?.['llmBaseUrl'] ?? '',
    apiKey: settingsData?.['llm']?.['llmApiKey'] ?? ''
  })
  try {
    const response = await client.chat.completions.create({
      model: settingsData?.['llm']?.['llmModel'],
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `${imageBase64}`
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    })
    return response.choices[0].message.content
  } catch (e) {
    console.error(e)
  }
  return null
}

export function extractJSONFromLLMResposne(response: string) {
  if (!response || typeof response !== 'string') return null

  // Remove everything inside <thought></thought> tags (including nested ones)
  const cleaned = response.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim()

  // 1. Try parsing the whole string first (clean JSON response)
  try {
    return JSON.parse(cleaned.trim())
  } catch {}

  // 2. Extract from ```json ... ``` code blocks
  const jsonBlockMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/i)
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim())
    } catch {}
  }

  // 3. Extract from generic ``` ... ``` code blocks
  const codeBlockMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim())
    } catch {}
  }

  // 4. Find the first { ... } or [ ... ] block in mixed text
  const firstBrace = cleaned.indexOf('{')
  const firstBracket = cleaned.indexOf('[')

  let startIndex = -1
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace
  } else if (firstBracket !== -1) {
    startIndex = firstBracket
  }

  if (startIndex !== -1) {
    const openChar = cleaned[startIndex]
    const closeChar = openChar === '{' ? '}' : ']'

    let lastIndex = cleaned.lastIndexOf(closeChar)
    while (lastIndex > startIndex) {
      try {
        return JSON.parse(cleaned.slice(startIndex, lastIndex + 1))
      } catch {
        lastIndex = cleaned.lastIndexOf(closeChar, lastIndex - 1)
      }
    }
  }

  return null
}

export async function runPromptWithJSONReponse(prompt: string): Promise<any> {
  return extractJSONFromLLMResposne((await runPrompt(prompt)) ?? '')
}

export async function runPromptWithImageJSONReponse(prompt: string, image: string): Promise<any> {
  return extractJSONFromLLMResposne((await runPromptWithImage(prompt, image)) ?? '')
}
