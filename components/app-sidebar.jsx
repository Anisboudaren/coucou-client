"use client"

import * as React from "react"
import {
  IconInnerShadowTop,

} from "@tabler/icons-react"

import {
  Bot,
  TerminalSquare,
  Settings2,
  Link,
  KeyRound,
  Settings,
  Video,
  LifeBuoy,
  MessageCircle,
  MessagesSquare,
  BarChart2,
  Download,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Coucou AI",
    email: "support@coucou.ai",
    avatar: "/avatars/user-avatar.jpg",
  },
  navMain: [
    {
      title: "Build Agent",
      url: "/agents/build/",
      icon: Bot,
    },
    {
      title: "Test Agent",
      url: "/test",
      icon: TerminalSquare,
    },
    {
      title: "Edit Agent",
      url: "/edit",
      icon: Settings2,
    },
    {
      title: "Connect Agent",
      url: "/connect",
      icon: Link,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "API Key",
      url: "/api-key",
      icon: KeyRound,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Video Guides",
      url: "/videos",
      icon: Video,
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
  ],
  documents: [
    {
      name: "Live Chats",
      url: "/live-chats",
      icon: MessageCircle,
    },
    {
      name: "Active Conversations",
      url: "/active-conversations",
      icon: MessagesSquare,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: BarChart2,
    },
    {
      name: "Export Data",
      url: "/export",
      icon: Download,
    },
  ],
}


export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">CouCou Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
