import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@renderer/components/ui/sidebar'
import {
  LanguagesIcon,
  SettingsIcon,
  BookIcon,
  CircleQuestionMarkIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  StarIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { useSummary } from '../store/use-summary'
import { Link, useLocation } from 'react-router'
import { Summary } from '@renderer/types'
import { useEffect } from 'react'

type NavigationItem = {
  title?: string
  url: string
  icon?: React.FunctionComponent
}

type NavigationGroup = {
  title?: string
  items: NavigationItem[]
}

type Navigation = {
  groups: NavigationGroup[]
}

const navigation: Navigation = {
  groups: [
    {
      title: '',
      items: [
        {
          title: 'Explain Text',
          url: '/',
          icon: LanguagesIcon
        },
        {
          title: 'Dictionary',
          url: '/dictionary',
          icon: BookIcon
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: SettingsIcon
        },
        {
          title: 'How To Use',
          url: '/howto',
          icon: CircleQuestionMarkIcon
        }
      ]
    }
  ]
}

function SummaryListItem(summary: Summary) {
  const location = useLocation()

  const startSummary = useSummary((state) => state.starSummary)
  const deleteSummary = useSummary((state) => state.deleteSummary)
  let preview = summary?.sentences?.map((sentence) => sentence.sentence).join(' ')
  if (!preview) {
    preview = summary.promptText
  }
  return (
    <SidebarMenuItem key={summary.id}>
      <SidebarMenuButton asChild isActive={location.pathname === `/summary/${summary.id}`}>
        <Link to={`/summary/${summary.id}`} className="flex justify-between items-center w-full">
          <span className="truncate">{preview}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={(e) => e.preventDefault()}>
                <EllipsisVerticalIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem variant="destructive" onClick={() => deleteSummary(summary.id)}>
                <TrashIcon />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => startSummary(summary.id)}>
                <StarIcon fill={summary.starred ? 'white' : 'unset'} />
                {summary.starred ? 'Unstar' : 'Star'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => setIsScrolled(el.scrollTop > 0)
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [])

  const location = useLocation()

  const summaries = useSummary((state) => state.summaries.length)
  const starredSummaries = useSummary(
    (state) => state.summaries.filter((summary) => summary.starred).length
  )
  return (
    <Sidebar {...props}>
      <SidebarHeader className="titlebar">
        <div className="h-6"></div>
      </SidebarHeader>
      <SidebarContent className="relative" ref={scrollRef}>
        {navigation.groups.map((item) => (
          <SidebarGroup
            key={item.title}
            className={`sticky top-0 bg-sidebar z-10 ${isScrolled ? 'border-b' : ''}`}
          >
            {!!item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  let Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url}>
                          {Icon && <Icon />} {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="z-0">
          {summaries > 0 && (
            <>
              {starredSummaries > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>Starred</SidebarGroupLabel>
                  {useSummary
                    .getState()
                    .summaries.filter((summary) => summary.starred)
                    .map((summary) => (
                      <SummaryListItem key={summary.id} {...summary} />
                    ))}
                </SidebarGroup>
              )}
              <SidebarGroup>
                <SidebarGroupLabel>Recent</SidebarGroupLabel>
                {useSummary.getState().summaries.map((summary) => (
                  <SummaryListItem key={summary.id} {...summary} />
                ))}
              </SidebarGroup>
            </>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
