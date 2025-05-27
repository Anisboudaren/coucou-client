'use client';

import * as React from 'react';
import { IconInnerShadowTop } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

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
} from 'lucide-react';
import axios from 'axios';
import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Coucou AI',
    email: 'support@coucou.ai',
    avatar: '/logo.png',
  },
  navMain: [
    {
      title: 'Build Agent',
      url: '/v1/agents/build/',
      icon: Bot,
    },
    {
      title: 'Test Agent',
      url: '/v1/agents/test/',
      icon: TerminalSquare,
    },

    {
      title: 'Connect Agent',
      url: '/v1/agents/connect/',
      icon: Link,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: 'API Key',
      url: '/api-key',
      icon: KeyRound,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
    {
      title: 'Video Guides',
      url: '/videos',
      icon: Video,
    },
    {
      title: 'Support',
      url: '/support',
      icon: LifeBuoy,
    },
  ],
  documents: [
    {
      name: 'Live Chats',
      url: '/live-chats',
      icon: MessageCircle,
    },
    {
      name: 'Active Conversations',
      url: '/active-conversations',
      icon: MessagesSquare,
    },
    {
      name: 'Analytics',
      url: '/analytics',
      icon: BarChart2,
    },
    {
      name: 'Export Data',
      url: '/export',
      icon: Download,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/user/me`, {
          withCredentials: true,
        });
        console.log(response.data.data.email);
        console.log(response.data.data.username);
        console.log(response.data.data);
        const user = {
          name: response.data.data.username,
          email: response.data.data.email,
          avatar: '/logo.png',
        };
        setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };
    getMe();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <img src="/logo.png" alt="" className="w-6" />
                <span className="text-base font-semibold">CouCou Ai.</span>
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
      <SidebarFooter>{user ? <NavUser user={user} /> : null}</SidebarFooter>
    </Sidebar>
  );
}
