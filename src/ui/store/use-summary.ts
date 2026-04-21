import { create } from "zustand";
import {
  extractWords,
  getTranslationAndGrammarPoints,
  splitSentences,
} from "../services/summarize";
import { SummaryState, SummaryActions, Sentence } from "../types";

export const useSummary = create<SummaryState & SummaryActions>()(
  (set, get) => ({
    summaries: [],
    updateSummary(id, newProps) {
      set((state) => ({
        summaries: state.summaries.map((s) =>
          s.id === id ? { ...s, ...newProps } : s,
        ),
      }));
    },
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
      async () => {
        try {
          const sentences: Sentence[] = await Promise.all(
            (await splitSentences(text)).map(async (sentence) => {
              const words = await extractWords(sentence);
              const grammarAndTranslation =
                await getTranslationAndGrammarPoints(sentence);
              const res: Sentence = {
                words: words,
                translation: grammarAndTranslation.translations,
                grammarPoints: grammarAndTranslation.grammarpoins,
                sentence: sentence,
              };
              return res;
            }),
          );
          get().updateSummary(newSummary.id, {
            processing: false,
            processingStage: "Done",
            sentences,
          });
        } catch {
          get().updateSummary(newSummary.id, {
            processing: false,
            processingStage: "Failed",
          });
        }
      };
      return newSummary;
    },
  }),
);
