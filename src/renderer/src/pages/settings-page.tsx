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

export function SettingsPage() {
  const settings = useSettings()
  const saveSettings = useSettings((state) => state.saveSettings)

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
                <Input
                  placeholder="AIzaSasdfYlasdfsadffUsdfCsLt-Aec"
                  type="password"
                  value={settings.llm.llmApiKey}
                  onChange={(e) => {
                    useSettings.setState({
                      llm: {
                        ...useSettings.getState().llm,
                        llmApiKey: e.target.value
                      }
                    })
                  }}
                />
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
