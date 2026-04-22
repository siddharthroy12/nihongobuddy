import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/components/ui/sidebar";
import {
  LanguagesIcon,
  SettingsIcon,
  BookIcon,
  CircleQuestionMarkIcon,
  EllipsisVerticalIcon,
  CreditCardIcon,
  LogOutIcon,
  UserIcon,
  TrashIcon,
  StarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";
import { useSummary } from "../store/use-summary";
import { Link } from "react-router";

type NavigationItem = {
  title?: string;
  url: string;
  icon?: React.FunctionComponent;
};

type NavigationGroup = {
  title?: string;
  items: NavigationItem[];
};

type Navigation = {
  groups: NavigationGroup[];
};

const navigation: Navigation = {
  groups: [
    {
      title: "",
      items: [
        {
          title: "Explain Text",
          url: "/",
          icon: LanguagesIcon,
        },
        {
          title: "Dictionary",
          url: "/discovered",
          icon: BookIcon,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: SettingsIcon,
        },
        {
          title: "How To Use",
          url: "/howto",
          icon: CircleQuestionMarkIcon,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const summaries = useSummary((state) => state.summaries.length);
  return (
    <Sidebar {...props}>
      <SidebarHeader className="titlebar">
        <div className="h-6"></div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {navigation.groups.map((item) => (
          <SidebarGroup key={item.title}>
            {!!item.title && (
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  let Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          {Icon && <Icon />} {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {summaries > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            {useSummary.getState().summaries.map((summary) => (
              <SidebarMenuItem key={summary.id}>
                <SidebarMenuButton asChild>
                  <div className="flex justify-between">
                    <Link
                      to={`/summary/${summary.id}`}
                      className="w-full truncate"
                    >
                      {summary.promptText}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button>
                          <EllipsisVerticalIcon />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem variant="destructive">
                          <TrashIcon />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <StarIcon />
                          Star
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
