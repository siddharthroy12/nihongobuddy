import { extractJSONFromLLMResposne } from './llm'

export async function runPrompt(prompt: string): Promise<string> {
  // @ts-ignore
  return (await window.api.runPrompt(prompt)) as string
}
export async function runPromptWithImage(prompt: string, image: string): Promise<string> {
  // @ts-ignore
  return (await window.api.runPromptWithImage({
    prompt: prompt,
    imageBase64: image
  })) as string
}

export async function runPromptWithJSONReponse(prompt: string): Promise<any> {
  //@ts-ignore
  return extractJSONFromLLMResposne(await runPrompt(prompt))
}

export async function runPromptWithImageJSONReponse(prompt: string, image: string): Promise<any> {
  //@ts-ignore
  return extractJSONFromLLMResposne(await runPromptWithImage(prompt, image))
}
