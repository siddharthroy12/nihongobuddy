import { create } from "zustand";

type Sentence = {
  sentence: string;
};

type Summary = {
  promptText: string;
  promptImageUrl: string;
};
const useSummary = create((set) => {});
