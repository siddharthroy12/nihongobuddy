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
import { Link } from 'react-router'
import { Summary } from '@renderer/types'

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
          url: '/discovered',
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
  const startSummary = useSummary((state) => state.starSummary)
  const deleteSummary = useSummary((state) => state.deleteSummary)
  return (
    <SidebarMenuItem key={summary.id}>
      <SidebarMenuButton asChild>
        <div className="flex justify-between">
          <Link to={`/summary/${summary.id}`} className="w-full truncate">
            {summary.promptText}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <EllipsisVerticalIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  deleteSummary(summary.id)
                }}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  startSummary(summary.id)
                }}
              >
                <StarIcon fill={summary.starred ? 'white' : 'unset'} />
                {summary.starred ? 'Unstar' : 'Star'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const summaries = useSummary((state) => state.summaries.length)
  const starredSummaries = useSummary(
    (state) => state.summaries.filter((summary) => summary.starred).length
  )
  return (
    <Sidebar {...props}>
      <SidebarHeader className="titlebar">
        <div className="h-6"></div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {navigation.groups.map((item) => (
          <SidebarGroup key={item.title}>
            {!!item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  let Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
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
      </SidebarContent>
    </Sidebar>
  )
}
