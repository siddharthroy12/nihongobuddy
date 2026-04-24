import { useParams, useNavigate } from 'react-router'
import { Spinner } from '../components/ui/spinner'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { ColoredWords } from '../components/colored-words'
import { Button } from '@renderer/components/ui/button'
import { BanIcon, RotateCwIcon, TrashIcon } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item'
import { Summary } from 'src/common/types'
import { useGetSummaryById } from '@renderer/queries/summary'

function InputPreview({
  prompt,
  processing,
  image
}: {
  prompt: string
  processing?: boolean
  image: string
}) {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">{processing ? <Spinner /> : <BanIcon />}</ItemMedia>
      <ItemContent>
        <ItemTitle>{processing ? 'Processing' : 'Failed to process'}</ItemTitle>
        <ItemDescription>
          {image ? <img src={image} className="block w-[200px] rounded-sm" /> : prompt}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

export function SummaryComp(summary: Summary) {
  return (
    <div className="flex flex-col gap-5">
      {summary?.sentences?.map((sentence, index) => (
        <Card size="sm" className="rounded-md" key={index}>
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
  const { data: summary } = useGetSummaryById(id!)
  const navigate = useNavigate()

  if (summary?.processing) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-col gap-3">
        <InputPreview prompt={summary.promptText} image={summary.promptImageUrl} processing />
      </div>
    )
  }

  if (summary?.error || summary?.sentences?.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-col gap-4">
        <InputPreview prompt={summary.promptText} image={summary.promptImageUrl} />
        {!!summary.error && <p className="text-muted-foreground text-sm">{summary.error}</p>}
        <div className="flex gap-3">
          <Button
            variant={'outline'}
            onClick={() => {
              window.api.retrySummarization(summary.id)
            }}
          >
            <RotateCwIcon />
            Retry
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => {
              navigate('/')
              window.api.deleteSummary(summary.id)
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
