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
} from "lucide-react";
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
          title: "Discovered",
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
                  <Link to={`/summary/${summary.id}`}>
                    {summary.promptText}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
