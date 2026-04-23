import { useSummary } from '../store/use-summary'
import { useParams, useNavigate } from 'react-router'
import { Spinner } from '../components/ui/spinner'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { ColoredWords } from '../components/colored-words'
import { Button } from '@renderer/components/ui/button'
import { RotateCwIcon, ScanText, TrashIcon } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item'
import { Summary } from '@renderer/types'

function InputPreview({ prompt, processing }: { prompt: string; processing?: boolean }) {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">{processing ? <Spinner /> : <ScanText />}</ItemMedia>
      <ItemContent>
        <ItemTitle>{processing ? 'Processing' : 'Input'}</ItemTitle>
        <ItemDescription>{prompt}</ItemDescription>
      </ItemContent>
    </Item>
  )
}

export function SummaryComp(summary: Summary) {
  return (
    <div className="flex flex-col gap-5">
      {summary?.sentences
        ?.filter((sentence) => sentence?.words?.length > 0)
        ?.map((sentence) => (
          <Card size="sm" className="rounded-md">
            <CardHeader>
              <ColoredWords words={sentence.words} />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <blockquote className="border-l-2 pl-6 italic">{sentence.translation}</blockquote>
              <ul className="ml-6 list-disc [&>li]:mt-2">
                {sentence?.grammarpoints?.map((point) => (
                  <li>
                    {point.point}: {point.explanation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

export function SummaryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const summary = useSummary((state) => state.summaries.find((el) => el.id == id))
  const deleteSummary = useSummary((state) => state.deleteSummary)
  const retrySummarization = useSummary((state) => state.retrySummarization)
  console.log(summary)

  if (summary?.processing) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-col gap-3">
        <InputPreview prompt={summary.promptText} processing />
      </div>
    )
  }

  if (summary?.error || summary?.sentences?.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-col gap-4">
        <InputPreview prompt={summary.promptText} />
        <p className="text-destructive font-medium">Failed to summarize</p>
        {!!summary.error && <p className="text-muted-foreground text-sm">{summary.error}</p>}
        <div className="flex gap-3">
          <Button
            variant={'outline'}
            onClick={() => {
              retrySummarization(summary.id)
            }}
          >
            <RotateCwIcon />
            Retry
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => {
              navigate('/')
              deleteSummary(summary.id)
            }}
          >
            <TrashIcon />
            Delete
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <SummaryComp {...summary!} />
    </div>
  )
}
