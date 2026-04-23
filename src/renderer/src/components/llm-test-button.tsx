import React, { useState } from 'react'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { runPrompt } from '../lib/electron-api'
import { toast } from 'sonner'
import { RocketIcon } from 'lucide-react'

export function LLMTestButton() {
  const [isTesting, setIsTesting] = useState(false)

  async function startTest() {
    setIsTesting(true)
    try {
      const res = await runPrompt('hello')
      if (res) {
        toast.success('LLM is working')
      } else {
        throw Error()
      }
    } catch {
      toast.error('LLM connection failed')
    }
    setIsTesting(false)
  }

  if (isTesting) {
    return (
      <Button disabled>
        <Spinner /> Testing LLM Connection
      </Button>
    )
  }

  return (
    <Button onClick={startTest}>
      <RocketIcon />
      Test LLM Connection
    </Button>
  )
}
