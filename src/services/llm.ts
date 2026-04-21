import OpenAI from "openai";
const client = new OpenAI({
  baseURL: "http://127.0.0.1:1234/v1", // your local LLM's URL
  apiKey: "ollama", // most local servers don't check this
});

export async function runPrompt(prompt: string) {
  console.log(prompt);
  try {
    const response = await client.responses.create({
      model: "google/gemma-4-e4b",
      input: prompt,
    });
    return response.output_text;
  } catch (e) {
    console.error(e);
  }
}
