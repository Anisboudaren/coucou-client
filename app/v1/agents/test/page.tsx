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
import { Bot, Laptop2, Smartphone } from 'lucide-react';

// Import Shadcn Dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Agent = { id: string; name: string };

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [scale, setScale] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const Router = useRouter();

  const previewHtml =
    process.env.NODE_ENV === 'production' ? 'chat-preview-prod.html' : 'chat-preview.html';

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

  // Scale calculation for desktop preview (still used inside dialog)
  useEffect(() => {
    function updateScale() {
      if (previewMode === 'desktop') {
        const maxWidth = 900; // max iframe width in px
        const windowWidth = window.innerWidth;
        if (windowWidth < maxWidth) {
          const calculatedScale = (windowWidth - 40) / maxWidth; // 40px margin total
          setScale(calculatedScale < 0.5 ? 0.5 : calculatedScale); // minimum scale 0.5
        } else {
          setScale(1);
        }
      } else {
        setScale(1);
      }
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [previewMode]);

  useEffect(() => {
    if (!isDialogOpen) {
      // When dialog closes, switch preview mode back to mobile
      setPreviewMode('mobile');
    }
  }, [isDialogOpen]);

  function handleConnect(selectedAgentId: string): void {
    Router.push(`/v1/agents/connect/${selectedAgentId}`);
  }

  function openDesktopPreview() {
    setPreviewMode('desktop');
    setIsDialogOpen(true);
  }

  function openMobilePreview() {
    setPreviewMode('mobile');
    setIsDialogOpen(false);
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
                      </div>
                      <div className="mt-6">
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
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Preview</h2>
                        <div className="flex gap-2">
                          <button
                            onClick={openMobilePreview}
                            className={`text-md flex items-center gap-2 rounded px-3 py-1 ${
                              previewMode === 'mobile' ? 'bg-primary text-white' : 'bg-muted'
                            }`}
                          >
                            <Smartphone /> Mobile
                          </button>
                          <button
                            onClick={openDesktopPreview}
                            className={`text-md flex items-center gap-2 rounded px-3 py-1 ${
                              previewMode === 'desktop' ? 'bg-primary text-white' : 'bg-muted'
                            }`}
                          >
                            <Laptop2 /> Desktop
                          </button>
                        </div>
                      </div>

                      {/* Mobile preview inline */}
                      {previewMode === 'mobile' && (
                        <div className="flex h-full flex-grow justify-center">
                          <iframe
                            key={`${selectedAgentId}-mobile`} // reload on change
                            src={`/${previewHtml}?id=${selectedAgentId}`}
                            className="rounded-lg border"
                            title="Chat Preview"
                            style={{
                              width: '375px',
                              height: '100%',
                              transition: 'width 0.3s ease, transform 0.3s ease',
                              transformOrigin: 'top left',
                              transform: 'scale(1)',
                            }}
                          />
                        </div>
                      )}

                      {/* Desktop preview: dialog opened */}
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent
                          style={{
                            width: '90vw',
                            height: '90vh',
                            padding: 0,
                            overflow: 'hidden',
                            borderRadius: '1rem',
                          }}
                          className="h-[85vh] w-[90vw] max-w-none! overflow-hidden rounded-2xl p-0"
                        >
                          <DialogHeader className="flex hidden items-center justify-between border-b px-4 py-2">
                            <DialogTitle>Desktop Preview</DialogTitle>
                          </DialogHeader>
                          <iframe
                            key={`${selectedAgentId}-desktop`} // reload on change
                            src={`/${previewHtml}?id=${selectedAgentId}`}
                            className="h-full w-full" // subtract header height
                            title="Chat Preview Desktop"
                            style={{
                              border: 'none',
                              transformOrigin: 'top left',
                              transform: `scale(${scale})`,
                            }}
                          />
                        </DialogContent>
                      </Dialog>
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
