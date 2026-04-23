import { extractJSONFromLLMResposne } from './llm'

export async function runPrompt(prompt: string): Promise<string> {
  // @ts-ignore
  return (await window.api.runPrompt(prompt)) as string
}

export async function runPromptWithJSONReponse(prompt: string): Promise<any> {
  //@ts-ignore
  return extractJSONFromLLMResposne(await window.api.runPrompt(prompt))
}
