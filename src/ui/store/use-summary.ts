import { create } from "zustand";

type Word = {
  text: string;
  type: string;
  furigana: string;
  meaning: string;
};

type Sentence = {
  sentence: string;
  processing: boolean;
  words: Word[];
};

type Summary = {
  promptText: string;
  promptImageUrl: string;
  processing: boolean;
  processingStage: string;
  sentences: Sentence[];
  id: string;
};

type SummaryState = {
  summaries: Summary[];
};

type SummaryActions = {
  startSummarization: (text: string) => Summary;
};

export const useSummary = create<SummaryState & SummaryActions>()((set) => ({
  summaries: [],
  startSummarization(text) {
    const newSummary = {
      id: crypto.randomUUID(),
      promptText: text,
      promptImageUrl: "",
      processing: true,
      processingStage: "Extracting sentences",
      sentences: [],
    };
    set((state) => ({
      summaries: [...state.summaries, newSummary],
    }));
    async () => {};
    return newSummary;
  },
}));
