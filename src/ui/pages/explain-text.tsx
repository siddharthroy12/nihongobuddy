import React from "react";
import { PromptInput } from "../components/prompt-input";
import { LanguagesIcon } from "lucide-react";

export default function ExplainText() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-[500px] w-full">
        <div className="flex flex-col gap-2">
          <LanguagesIcon size={40} />
          <PromptInput />
        </div>
      </div>
    </div>
  );
}
