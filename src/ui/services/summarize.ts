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

function createPromptForExtractingWords(text: string) {
  return `
YOU ARE A MACHINE THAT HAS ONLY ONE JOB AND THAT JOB IS TO EXTRACT WORDS FROM JAPANESE SENTENCE. YOU'LL BE GIVEN A JAPANESE
SENTENCES AND YOU HAVE TO GIVE AN ARRAY CONTAINING INFORMATION ABOUT WORDS.

==== TEXT BEING ====
${text}
==== TEXT END ======

Example Output:
[
    {
        "word": "美味しい",
        "type": "Adjective"
        "furigana": "おいしい",
        "meaning”: "Delicious, tasty"
    },
    {
        "word": "です",
        "type": "Copula / Polite Marker"
        "furigana": "です",
        "meaning”: "Is / To be (polite)	"
    },
]

In your output only an array should be present. And the structure of the object should not change.
`;
}

function createPromptForExtractingWords(text: string) {
  return `
YOU ARE A MACHINE THAT HAS ONLY ONE JOB AND THAT JOB IS TO EXTRACT WORDS FROM JAPANESE SENTENCE. YOU'LL BE GIVEN A JAPANESE
SENTENCES AND YOU HAVE TO GIVE AN ARRAY CONTAINING INFORMATION ABOUT WORDS.

==== TEXT BEING ====
${text}
==== TEXT END ======

Example Output:
[
    {
        "word": "美味しい",
        "type": "Adjective"
        "furigana": "おいしい",
        "meaning”: "Delicious, tasty"
    },
    {
        "word": "です",
        "type": "Copula / Polite Marker"
        "furigana": "です",
        "meaning”: "Is / To be (polite)	"
    },
]

In your output only an array should be present. And the structure of the object should not change.
`;
}

export async function splitSentences(text: string) {
  const prompt = createPromptForSplitSentence(text);
  // @ts-ignore
  const res = await window.electronAPI.runPrompt(prompt);
}

export async function extractWords(sentence: string) {
  const prompt = createPromptForExtractingWords(sentence);
  // @ts-ignore
  const res = await window.electronAPI.runPrompt(prompt);
}

export async function getTranslationAndGrammarPoints(sentence: string) {}

async function summarizeSentence(sentence: string) {}

async function startSummrization(text: string) {
  const sentences = await splitSentences(text);
}
