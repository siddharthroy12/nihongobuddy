import React, { useState, useRef } from 'react'
import { Field, FieldLabel } from '@renderer/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from '@renderer/components/ui/input-group'
import { ArrowUpIcon, ImageIcon, Loader2Icon } from 'lucide-react'
import { useSummary } from '../store/use-summary'
import { useNavigate } from 'react-router'
import { extractTextFromImage } from '@renderer/lib/ocr'

export function PromptInput() {
  const startSummarization = useSummary((state) => state.startSummarization)
  const [input, setInput] = useState<string>('')
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  let navigate = useNavigate()

  function onClickUploadImage() {
    fileInputRef.current?.click()
  }

  async function onImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessingImage(true)
    try {
      const extractedText = await extractTextFromImage(file)
      setInput(extractedText)
    } finally {
      setIsProcessingImage(false)
      e.target.value = ''
    }
  }

  function onSubmit() {
    const summary = startSummarization(input)
    navigate(`/summary/${summary.id}`)
  }

  return (
    <Field>
      <FieldLabel htmlFor="block-end-textarea">
        <p className="text-xl">Enter 日本語 To Summarize The Sentence</p>
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
          placeholder="Write a comment..."
          className="max-h-[200px]"
          value={isProcessingImage ? '' : input}
          placeholder={isProcessingImage ? 'Extracting text from image...' : 'Write a comment...'}
          disabled={isProcessingImage}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            size="sm"
            onClick={onClickUploadImage}
            disabled={isProcessingImage}
          >
            {isProcessingImage ? (
              <>
                <Loader2Icon className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ImageIcon />
                Scan Image
              </>
            )}
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            size="icon-sm"
            className="ml-auto"
            onClick={onSubmit}
            disabled={isProcessingImage}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
