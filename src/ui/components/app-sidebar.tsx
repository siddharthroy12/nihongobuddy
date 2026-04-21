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
  SidebarRail,
} from "@/ui/components/ui/sidebar";
import {
  LanguagesIcon,
  SettingsIcon,
  BookIcon,
  CircleQuestionMarkIcon,
} from "lucide-react";

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
          url: "#",
          icon: LanguagesIcon,
        },
        {
          title: "Discovered",
          url: "#",
          icon: BookIcon,
        },
        {
          title: "Settings",
          url: "#",
          icon: SettingsIcon,
        },
        {
          title: "How To Use",
          url: "#",
          icon: CircleQuestionMarkIcon,
        },
      ],
    },
    {
      title: "Recent",
      items: [
        {
          title: "おはよ",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                        <a href={item.url}>
                          {Icon && <Icon />} {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
