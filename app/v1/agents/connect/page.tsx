/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';
import { IntegrationPlatformCards } from '@/components/section-cards-platforms';
import axios from 'axios';

type Agent = {
  id: string;
  name: string;
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();
  const [selectedAgentName, setSelectedAgentName] = useState<string | undefined>();

  useEffect(() => {
    const getAgents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent`, {
          withCredentials: true,
        });
        const data = response.data as { data: Agent[] };
        setAgents(data.data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
        toast.error('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };
    getAgents();
  }, []);

  const scriptSnippet = selectedAgentId
    ? `<script 
  src="${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/scripts/bubble.js" 
  data-agent-id="${selectedAgentId}"
  defer
></script>`
    : '';

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative pb-14">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4 md:px-6">
            <div className="flex items-center justify-between gap-2 py-4 md:py-6">
              <div className="px-2">
                <h1 className="text-2xl font-semibold">Integrate Your AI Agent</h1>
              </div>

              <div className="flex items-center gap-2 px-2">
                <span className="text-muted-foreground text-sm font-medium">Pick an agent</span>
                <Select
                  onValueChange={value => {
                    setSelectedAgentId(value);
                    const found = agents.find(a => a.id === value);
                    setSelectedAgentName(found?.name);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
                {selectedAgentId ? (
                  <div className="bg-sidebar flex w-full flex-col rounded-2xl border-[0.5px] border-gray-400 p-6">
                    <IntegrationPlatformCards script={scriptSnippet} />
                  </div>
                ) : (
                  <div className="bg-sidebar text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border-[0.5px] border-dashed border-gray-400 p-8 text-center">
                    <CopyIcon className="text-muted-foreground h-10 w-10" />
                    <p className="text-lg font-medium">Choose an agent to begin integration</p>
                    <p className="text-sm">
                      Select an agent from the dropdown to view the embed script.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
