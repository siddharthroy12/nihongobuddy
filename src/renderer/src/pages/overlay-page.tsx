import { Button } from '@renderer/components/ui/button'
import { Spinner } from '@renderer/components/ui/spinner'
import { CircleXIcon } from 'lucide-react'
import { SummaryComp } from './summary-page'
import { useEffect, useState } from 'react'
import { Summary } from 'src/common/types'

function OverlaySummary({ image }: { image: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | undefined>()

  useEffect(() => {
    setIsLoading(true)
    async function effect() {
      try {
        if (image) {
          const id = await window.api.startSummarizationFromImage(image)
          window.api.onSummaryUpdate(async () => {
            setSummary(await window.api.getSummaryById(id))
            setIsLoading(false)
          })
        }
      } catch {}
    }
    effect()
  }, [image])

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
  const [image, setImage] = useState('')

  function closeWindow() {
    // @ts-ignore
    window.api.closeOverlayWindow()
  }
  useEffect(() => {
    //@ts-ignore
    window.api.onScreenshot((dataUrl) => {
      setImage(dataUrl)
    })
  }, [])

  return (
    <div className="bg-black/50 w-screen h-screen">
      <div className="titlebar fixed top-0 left-0 right-10 h-10"></div>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-0 right-0"
        onClick={() => {
          closeWindow()
        }}
      >
        <CircleXIcon />
      </Button>
      <div className="overflow-scroll h-full p-3 mb-10">
        <OverlaySummary image={image} />
      </div>
    </div>
  )
}
