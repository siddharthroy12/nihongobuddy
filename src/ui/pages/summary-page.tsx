import React from "react";
import { useSummary } from "../store/use-summary";
import { useParams } from "react-router";
import { Spinner } from "../components/ui/spinner";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ColoredWords } from "../components/colored-words";

export function SummaryPage() {
  const { id } = useParams();
  const summary = useSummary((state) =>
    state.summaries.find((el) => el.id == id),
  );
  console.log(summary);

  if (summary?.processing) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-col gap-3">
        <Spinner />
        Processing...
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {summary?.sentences
        ?.filter((sentence) => sentence?.words?.length > 0)
        ?.map((sentence) => (
          <Card size="sm" className="rounded-md">
            <CardHeader>
              <ColoredWords words={sentence.words} />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <blockquote className="border-l-2 pl-6 italic">
                {sentence.translation}
              </blockquote>
              {/* <WordsTable words={sentence.words} /> */}
              <ul className="ml-6 list-disc [&>li]:mt-2">
                {sentence?.grammarpoints?.map((point) => (
                  <li>
                    {point.point}: {point.explanation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
