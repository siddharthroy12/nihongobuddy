import { runPromptWithJSONReponse } from "../lib/electron-api";
import { GrammerPoint, Word } from "../types";

function createPromptForSplitSentence(text: string) {
  return `
YOU ARE A MACHINE THAT HAS ONLY ONE JOB AND THAT JOB IS TO EXTRACT JAPANESE SENTENCES AND WORDS FROM GIVEN TEXT AND RETURN
IT AS AN ARRAY OF STRINGS. EACH ENTRY OF STRING SHOULD CONTAIN EITHER A SENTENCE OR A WORD

==== TEXT BEING ====
${text}
==== TEXT END ======

Example Output:
[
    "どの飲み物が好きですか？",
    "甘いものがいいですか、それともしょっぱいものがいいですか？"
]

In your output only an array should be present.
`;
}

export async function splitSentences(text: string): Promise<string[]> {
  const prompt = createPromptForSplitSentence(text);
  return await runPromptWithJSONReponse(prompt);
}

function createPromptForGeneratingSummary(text: string) {
  return `
YOU ARE A JAPANESE LANGUAGE ANALYSIS MACHINE. YOUR ONLY JOB IS TO ANALYZE THE GIVEN TEXT AND RETURN A SINGLE JSON OBJECT.

==== TEXT BEGIN ====
${text}
==== TEXT END ====

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
`;
}

export async function generateSummary(text: string) {
  const prompt = createPromptForGeneratingSummary(text);
  return await runPromptWithJSONReponse(prompt);
}
