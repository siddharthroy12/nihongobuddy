import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@renderer/components/ui/field'
import { Input } from '@renderer/components/ui/input'

import { useSettings } from '../store/use-settings'
import { useDebounceEffect } from '../hooks/use-debounce'
import { LLMTestButton } from '../components/llm-test-button'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@renderer/components/ui/button'
import { ButtonGroup } from '@renderer/components/ui/button-group'
import { TrashIcon } from 'lucide-react'

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

function ShortcutRecorder({
  value,
  onChange
}: {
  value: string
  onChange: (shortcut: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [displayValue, setDisplayValue] = useState(value || 'Not set')
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setDisplayValue(value || 'Click to set a shortcut')
  }, [value])

  const formatKeys = (e: KeyboardEvent): string => {
    const parts: string[] = []
    if (e.metaKey) parts.push('Meta')
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey) parts.push('Shift')

    const key = e.key
    if (!['Meta', 'Control', 'Alt', 'Shift'].includes(key)) {
      parts.push(key.length === 1 ? key.toUpperCase() : key)
    }

    return parts.join('+')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Allow Escape to cancel recording
    if (e.key === 'Escape') {
      setIsRecording(false)
      setDisplayValue(value || 'Not set')
      return
    }

    // Require at least one modifier key
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) return

    const shortcut = formatKeys(e)
    // Need a non-modifier key too
    if (['Meta', 'Ctrl', 'Alt', 'Shift'].includes(e.key)) return

    setDisplayValue(shortcut)
    onChange(shortcut)
    setIsRecording(false)
  }

  useEffect(() => {
    if (isRecording) {
      window.addEventListener('keydown', handleKeyDown, true)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isRecording, value])

  const handleClick = () => {
    setIsRecording(true)
    setDisplayValue('Press shortcut...')
    ref.current?.focus()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setDisplayValue('Not set')
    setIsRecording(false)
  }

  return (
    <div className="flex items-center gap-2">
      <ButtonGroup>
        <Button
          ref={ref}
          variant={'outline'}
          onClick={handleClick}
          onBlur={() => {
            if (isRecording) {
              setIsRecording(false)
              setDisplayValue(value || 'Not set')
            }
          }}
          className={[
            isRecording
              ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 animate-pulse'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground'
          ].join(' ')}
        >
          {isRecording ? (
            <>
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              {displayValue}
            </>
          ) : (
            <>
              <KeyboardIcon />
              {displayValue}
            </>
          )}
        </Button>
        {value && !isRecording && (
          <Button variant={'outline'} onClick={handleClear}>
            <TrashIcon className="text-destructive" />
          </Button>
        )}
      </ButtonGroup>
    </div>
  )
}

function KeyboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" ry="2" />
      <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
    </svg>
  )
}

export function SettingsPage() {
  const settings = useSettings()
  const saveSettings = useSettings((state) => state.saveSettings)
  const [showApiKey, setShowApiKey] = useState(false)

  useDebounceEffect(() => {
    saveSettings()
  }, [settings])

  return (
    <div className="w-full">
      <form>
        <FieldGroup>
          {/* LLM Settings */}
          <FieldSet>
            <FieldLegend>LLM Settings</FieldLegend>
            <FieldDescription>Choose which LLM to connect to.</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>API URL</FieldLabel>
                <Input
                  placeholder="https://generativelanguage.googleapis.com/v1beta/openai/"
                  value={settings.llm.llmBaseUrl}
                  onChange={(e) => {
                    useSettings.setState({
                      llm: {
                        ...useSettings.getState().llm,
                        llmBaseUrl: e.target.value
                      }
                    })
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>API KEY</FieldLabel>
                <div className="relative">
                  <Input
                    placeholder="AIzaSasdfYlasdfsadffUsdfCsLt-Aec"
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.llm.llmApiKey}
                    onChange={(e) => {
                      useSettings.setState({
                        llm: {
                          ...useSettings.getState().llm,
                          llmApiKey: e.target.value
                        }
                      })
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </Field>
              <Field>
                <FieldLabel>Model</FieldLabel>
                <Input
                  placeholder="google/gemma-4"
                  value={settings.llm.llmModel}
                  onChange={(e) => {
                    useSettings.setState({
                      llm: {
                        ...useSettings.getState().llm,
                        llmModel: e.target.value
                      }
                    })
                  }}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <LLMTestButton />

          {/* Shortcut Settings */}
          <FieldSet>
            <FieldLegend>Shortcut</FieldLegend>
            <FieldDescription>
              Configure a shortcut key to scan the screen and give translation and summary on a
              overlay window.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <ShortcutRecorder
                  value={settings.shortcut?.quicksummary ?? ''}
                  onChange={(shortcut) => {
                    useSettings.setState({
                      shortcut: {
                        ...useSettings.getState().shortcut,
                        quicksummary: shortcut
                      }
                    })
                  }}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}
