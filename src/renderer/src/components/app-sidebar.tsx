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
import { Link, useLocation } from 'react-router'
import { Summary } from '../../../common/types'
import { useEffect } from 'react'
import { useGetAllSummaries } from '@renderer/queries/summary'

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
              <DropdownMenuItem
                variant="destructive"
                onClick={() => window.api.deleteSummary(summary.id)}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.api.starSummary(summary.id)}>
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

  const { data: summaries } = useGetAllSummaries()

  const starredSummaries = summaries?.filter((summary) => summary.starred)
  return (
    <Sidebar {...props}>
      {window.electron.process.platform === 'darwin' && (
        <SidebarHeader className="titlebar">
          <div className="h-6"></div>
        </SidebarHeader>
      )}
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
          {(summaries?.length ?? 0) > 0 && (
            <>
              {(starredSummaries?.length ?? 0) > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>Starred</SidebarGroupLabel>
                  {starredSummaries
                    ?.filter((summary) => summary.starred)
                    .map((summary) => (
                      <SummaryListItem key={summary.id} {...summary} />
                    ))}
                </SidebarGroup>
              )}
              <SidebarGroup>
                <SidebarGroupLabel>Recent</SidebarGroupLabel>
                {summaries
                  ?.filter((summary) => !summary.starred)
                  .map((summary) => (
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
