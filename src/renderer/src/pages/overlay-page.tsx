import { Button } from '@renderer/components/ui/button'
import { Spinner } from '@renderer/components/ui/spinner'
import { extractTextFromImage } from '@renderer/lib/ocr'
import { useSummary } from '@renderer/store/use-summary'
import { Summary } from '@renderer/types'
import { CircleXIcon } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { SummaryComp } from './summary-page'

function OverlaySummary({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | undefined>()
  const startSummarization = useSummary((state) => state.startSummarization)

  useEffect(() => {
    async function effect() {
      setIsLoading(true)
      try {
        const s = await startSummarization(text)
        setSummary(s)
      } catch {}

      setIsLoading(false)
    }
    effect()
  }, [text])

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Spinner />
        Translating Text On Screen
      </div>
    )
  }

  return <SummaryComp {...summary!} />
}

export function OverlayPage() {
  const [scannedText, setScannedText] = useState('')
  const [isScanningScreen, setIsScanningScreen] = useState(false)

  function closeWindow() {
    // @ts-ignore
    window.api.closeOverlayWindow()
  }

  async function scanScreenshot(url) {
    setIsScanningScreen(true)
    const text = await extractTextFromImage(url)
    setScannedText(text)
    setIsScanningScreen(false)
  }

  useEffect(() => {
    //@ts-ignore
    window.api.onScreenshot((dataUrl) => {
      scanScreenshot(dataUrl)
    })
  }, [])

  let comp: ReactNode = null

  if (isScanningScreen) {
    comp = (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Spinner />
        Scanning Screen
      </div>
    )
  }
  if (scannedText) {
    comp = <OverlaySummary text={scannedText} />
  }

  return (
    <div className="bg-black/50 w-screen h-screen">
      <div className="titlebar fixed top-0 left-0 right-10 h-10"></div>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-0 right-0"
        onClick={() => {
          console.log('a')
          closeWindow()
        }}
      >
        <CircleXIcon />
      </Button>
      <div className="overflow-scroll h-full p-3 mb-10">{comp}</div>
    </div>
  )
}
