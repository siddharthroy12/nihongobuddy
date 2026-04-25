import { z } from 'zod'
import { runPromptWithImageJSONReponse, runPromptWithJSONReponse } from './llm'

const WordSchema = z.object({
  word: z.string(),
  type: z.string(),
  furigana: z.string(),
  meaning: z.string()
})

const GrammarPointSchema = z.object({
  point: z.string(),
  explanation: z.string()
})

const SentenceSchema = z.object({
  sentence: z.string(),
  translation: z.string(),
  words: z.array(WordSchema),
  grammarpoints: z.array(GrammarPointSchema)
})

const SummarySchema = z.object({
  sentences: z.array(SentenceSchema)
})

export type Word = z.infer<typeof WordSchema>
export type GrammarPoint = z.infer<typeof GrammarPointSchema>
export type Sentence = z.infer<typeof SentenceSchema>
export type Summary = z.infer<typeof SummarySchema>

function createPromptForGeneratingSummary(text: string, forImage = false) {
  return `
YOU ARE A JAPANESE LANGUAGE ANALYSIS MACHINE. YOUR ONLY JOB IS TO ANALYZE THE GIVEN ${forImage ? 'IMAGE' : 'TEXT'} AND RETURN A SINGLE JSON OBJECT.

${
  forImage
    ? ''
    : `
==== TEXT BEGIN ====
${text}
==== TEXT END ====
`
}

You must:
1. Split the text into individual Japanese sentences/phrases
2. For each sentence, extract all words with their details
3. For each sentence, provide a translation and grammar points

Example Output:
{
  "sentences": [
    {
      "sentence": "美味しいですね。",
      "translation": "It's delicious, isn't it?",
      "words": [
        {
          "word": "美味しい",
          "type": "Adjective",
          "furigana": "おいしい",
          "meaning": "Delicious, tasty"
        },
        {
          "word": "です",
          "type": "Copula / Polite Marker",
          "furigana": "です",
          "meaning": "Is / To be (polite)"
        },
        {
          "word": "ね",
          "type": "Sentence-ending particle",
          "furigana": "ね",
          "meaning": "Isn't it? / Right? (seeks agreement)"
        }
      ],
      "grammarpoints": [
        {
          "point": "〜ですね (desu ne)",
          "explanation": "Combining the polite copula です with the sentence-ending particle ね to seek agreement or confirmation from the listener."
        }
      ]
    }
  ]
}

Return ONLY the JSON object. No extra text, no markdown, no backticks.
`
}

export async function generateSummary(text: string): Promise<Summary> {
  const prompt = createPromptForGeneratingSummary(text)
  const raw = await runPromptWithJSONReponse(prompt)
  return SummarySchema.parse(raw)
}

export async function generateSummaryFromImage(image: string): Promise<Summary> {
  const prompt = createPromptForGeneratingSummary('', true)
  const raw = await runPromptWithImageJSONReponse(prompt, image)
  return SummarySchema.parse(raw)
}
