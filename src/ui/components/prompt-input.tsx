import React, { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/ui/components/ui/input-group";
import { ArrowUpIcon, ImageIcon } from "lucide-react";
import { splitSentences } from "../services/summarize";

export function PromptInput() {
  const [input, setInput] = useState<string>("");
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
              splitSentences(input);
            }}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
