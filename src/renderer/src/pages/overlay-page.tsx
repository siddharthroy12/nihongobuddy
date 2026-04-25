import { Button } from '@renderer/components/ui/button'
import { Spinner } from '@renderer/components/ui/spinner'
import { CircleXIcon, RotateCwIcon } from 'lucide-react'
import { SummaryComp } from './summary-page'
import { useEffect, useState } from 'react'
import { useGetSummaryById } from '@renderer/queries/summary'

function OverlaySummary({ image }: { image: string }) {
  const [id, setId] = useState('')
  const { data: summary } = useGetSummaryById(id)

  console.log(summary)

  useEffect(() => {
    async function effect() {
      try {
        if (image) {
          const id = await window.api.startSummarizationFromImage(image)
          setId(id)
        }
      } catch { }
    }
    effect()
  }, [image])

  if (summary?.processing) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Spinner />
        Translating Text On Screen
      </div>
    )
  }

  if (summary?.error || summary?.sentences?.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        Failed To Translate
        <Button
          onClick={() => {
            window.api.retrySummarization(id)
          }}
        >
          <RotateCwIcon />
          Retry
        </Button>
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
      <div className="overflow-y-scroll h-full p-3 mb-10">
        <OverlaySummary image={image} />
      </div>
    </div>
  )
}
