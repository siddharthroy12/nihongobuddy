import React, { useState } from "react";
import { Field, FieldLabel } from "@/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/ui/components/ui/input-group";
import { ArrowUpIcon, ImageIcon } from "lucide-react";
import { useSummary } from "../store/use-summary";
import { useNavigate } from "react-router";

export function PromptInput() {
  const startSummarization = useSummary((state) => state.startSummarization);
  const [input, setInput] = useState<string>("");
  let navigate = useNavigate();

  function onSubmit() {
    const summary = startSummarization(input);
    navigate(`/summary/${summary.id}`);
  }

  return (
    <Field>
      <FieldLabel htmlFor="block-end-textarea">
        Enter Text To Summarize The Sentence
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="block-end-textarea"
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton variant="outline" size="sm" className="">
            <ImageIcon />
            Add Image
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            size="icon-sm"
            className="ml-auto"
            onClick={() => {
              onSubmit();
            }}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
