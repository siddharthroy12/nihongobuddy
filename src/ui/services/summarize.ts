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

function createPromptForTranslationAndGrammar(text: string) {
  return `
YOU ARE A MACHINE THAT HAS ONLY ONE JOB AND THAT JOB IS TO TRANSLATE GIVEN JAPANESE SENTENCE AND EXPLAIN GRAMAMR.
YOUR OUTPUT WILL BE AN JSON AND ONLY JSON

==== TEXT BEING ====
${text}
==== TEXT END ======

Example Output:
{
    "translation": "Not only in romance, but even among friends; once trust is lost, it takes a considerable amount of time to restore it.",
    "grammarpoints": [
        {"point": "〜だけではなく (dake dewa naku)", "explanation": "Grammatical pattern meaning 'not only X, but also Y.' It connects two related ideas while emphasizing that the initial domain (X) is not the only one affected."},
        {"point": "の間でも (~no aida demo)", "explanation": "A combination of particles. '〜の' shows association. '間 (aida)' means space or among (people/things). Adding 'で (de)' marks location, and 'も (mo)' adds the meaning of 'even.' Together: 'even among [X]'. "},
        {"point": "〜が最後 (ga saigo)", "explanation": "A set phrase that signifies a decisive point or moment. It means 'once X has occurred' or 'at last having lost/suffered X,' implying a lasting consequence."},
        {"point": "Vるには (Vru ni wa)", "explanation": "Indicates condition or requirement, translating to 'in order to V' or 'for V to happen.' It sets up the necessary conditions for an action."}
    ]
}

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

export async function getTranslationAndGrammarPoints(sentence: string) {
  const prompt = createPromptForTranslationAndGrammar(sentence);
  // @ts-ignore
  const res = await window.electronAPI.runPrompt(prompt);
}

async function summarizeSentence(sentence: string) {}

async function startSummrization(text: string) {
  const sentences = await splitSentences(text);
}
