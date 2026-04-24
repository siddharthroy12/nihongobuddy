import React, { useState, useRef } from 'react'
import { Field, FieldLabel } from '@renderer/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from '@renderer/components/ui/input-group'
import { ArrowUpIcon, ImageIcon } from 'lucide-react'
import { useSummary } from '../store/use-summary'
import { useNavigate } from 'react-router'
import { fileToBase64URL } from '@renderer/lib/file'

export function PromptInput() {
  const startSummarization = useSummary((state) => state.startSummarization)
  const startSummarizationFromImage = useSummary((state) => state.startSummarizationFromImage)

  const [input, setInput] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  let navigate = useNavigate()

  function onClickUploadImage() {
    fileInputRef.current?.click()
  }

  async function onImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await startSummarizationFromImage(await fileToBase64URL(file), (id) => {
      navigate(`/summary/${id}`)
    })
  }

  async function onSubmit() {
    startSummarization(input, (id) => {
      navigate(`/summary/${id}`)
    })
  }

  return (
    <Field>
      <FieldLabel htmlFor="block-end-textarea">
        <p className="text-xl">
          Enter <span className="text-primary">日本語</span> To Summarize The Sentence
        </p>
      </FieldLabel>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageFileChange}
      />
      <InputGroup>
        <InputGroupTextarea
          id="block-end-textarea"
          className="max-h-[200px]"
          value={input}
          placeholder={'Write or paste a text'}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton variant="outline" size="sm" onClick={onClickUploadImage}>
            <ImageIcon />
            Scan Image
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            size="icon-sm"
            className="ml-auto"
            onClick={onSubmit}
            disabled={input.trim() === ''}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
