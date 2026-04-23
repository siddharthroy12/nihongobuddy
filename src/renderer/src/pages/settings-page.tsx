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
import { useState } from 'react'

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
        </FieldGroup>
      </form>
    </div>
  )
}
