'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot } from 'lucide-react';

type Agent = { id: string; name: string };

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();
  const Router = useRouter();
  useEffect(() => {
    const getAgents = async () => {
      try {
        const response = await axios.get(`/api/proxy/v1/agent`, {
          withCredentials: true,
        });
        const data = response.data as { data: Agent[] };
        setAgents(data.data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };
    getAgents();
  }, []);

  useEffect(() => {
    const convoId = localStorage.getItem('convoId');
    if (convoId) {
      localStorage.removeItem('convoId');
    }
  }, [selectedAgentId]);

  function handleConnect(selectedAgentId: string): void {
    // Redirect to the connect page for the selected agent
    Router.push(`/v1/agents/connect/${selectedAgentId}`);
  }

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
            <div className="flex justify-between gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex w-full items-center justify-between px-2">
                <h1 className="text-2xl font-semibold">Test Your AI Build</h1>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Pick an agent</span>
                  <Select onValueChange={setSelectedAgentId}>
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
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
                {selectedAgentId ? (
                  <>
                    {/* Customization Section */}
                    <div className="bg-sidebar flex w-full flex-col justify-between rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-1/3">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">Customization</h2>
                        <p className="text-muted-foreground">
                          Customize your AI agent&apos;s appearance and behavior to match your
                          brand.
                        </p>
                        {/* You can add customization controls here */}
                      </div>
                      <div className="mt-6">
                        {/* Example button or action */}
                        <button
                          onClick={() => handleConnect(selectedAgentId)}
                          className="bg-primary hover:bg-primary/90 w-full rounded-lg px-4 py-2 text-white"
                        >
                          Save & Continue to Connect
                        </button>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-sidebar flex w-full flex-col rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-2/3">
                      <h2 className="mb-4 text-xl font-semibold">Preview</h2>
                      <div className="h-0 min-h-[500px] flex-grow">
                        <iframe
                          key={selectedAgentId} // This forces reload when agent changes
                          src={`/chat-preview.html?id=${selectedAgentId}`}
                          className="h-full w-full rounded-lg border"
                          title="Chat Preview"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-sidebar text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border-[0.5px] border-dashed border-gray-400 p-8 text-center">
                    <Bot className="text-muted-foreground h-10 w-10" />
                    <p className="text-lg font-medium">Choose an agent to start testing</p>
                    <p className="text-sm">
                      Pick an agent from the dropdown above to preview your bot.
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
