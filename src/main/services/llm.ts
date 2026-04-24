import OpenAI from 'openai'
import { settings } from './store'

export async function runPrompt(prompt: string): Promise<string | null> {
  const settingsData = JSON.parse(settings.get())
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

export async function runPromptWithImage({
  prompt,
  imageBase64
}: {
  prompt: string
  imageBase64: string
  mimeType?: string
}): Promise<string | null> {
  const settingsData = JSON.parse(settings.get())
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
