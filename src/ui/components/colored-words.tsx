import React from "react";
import { Word } from "../types";
import { getColorForWordType } from "../lib/word-color";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/components/ui/tooltip";

type ColoredWordsProps = {
  words: Word[];
};

export function ColoredWord({ word, type, furigana, meaning }: Word) {
  const background = getColorForWordType(type);
  return (
    <Tooltip>
      <TooltipContent>
        <div className="flex flex-col">
          <p className="font-bold">Furigana</p>
          <p>{furigana}</p>
          <p className="font-bold">Type</p>
          <p>{type}</p>
          <p className="font-bold">Meaning</p>
          <p>{meaning}</p>
        </div>
      </TooltipContent>
      <TooltipTrigger>
        <div className="relative">
          <div
            className="text-white px-1 rounded-xs text-xl"
            style={{ background: background }}
          >
            {word}
          </div>
          <div
            className="bg-white absolute bottom-[-5px] left-0 right-0 h-[5px] opacity-50"
            style={{
              background,
            }}
          ></div>
        </div>
      </TooltipTrigger>
    </Tooltip>
  );
}

export function ColoredWords({ words }: ColoredWordsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {words?.map((word, i) => (
        <ColoredWord key={word.word + i} {...word} />
      ))}
    </div>
  );
}
