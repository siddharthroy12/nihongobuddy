export type Word = {
  word: string;
  type: string;
  furigana: string;
  meaning: string;
};

export type GrammerPoint = {
  point: string;
  explanation: string;
};

export type Sentence = {
  sentence: string;
  words: Word[];
  translation: string;
  grammarpoints: GrammerPoint[];
};

export type Summary = {
  promptText: string;
  promptImageUrl: string;
  processing: boolean;
  sentences: Sentence[];
  id: string;
  error: string;
};

export type Settings = {
  llm: {
    llmBaseUrl: string;
    llmApiKey: string;
    llmModel: string;
  };
};
