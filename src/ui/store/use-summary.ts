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
};

type SummaryState = {
  summaries: Summary[];
};

export const useSummary = create<UseSummaryState>()((set) => ({
  summaries: [],
}));
