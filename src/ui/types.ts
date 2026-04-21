export type Word = {
  text: string;
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
  grammarPoints: GrammerPoint[];
};

export type Summary = {
  promptText: string;
  promptImageUrl: string;
  processing: boolean;
  processingStage: string;
  sentences: Sentence[];
  id: string;
};

export type SummaryState = {
  summaries: Summary[];
};

export type SummaryActions = {
  startSummarization: (text: string) => Summary;
  updateSummary: (id: string, summary: Partial<Summary>) => void;
};
