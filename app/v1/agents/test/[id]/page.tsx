'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Bot, Laptop2, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Agent = { id: string; name: string };

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [scale, setScale] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const agentId = params.id as string;
  const previewHtml =
    process.env.NODE_ENV === 'production' ? 'chat-preview-prod.html' : 'chat-preview.html';

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent/${agentId}`,
          {
            withCredentials: true,
          },
        );
        const data = res.data as { data: Agent };
        setAgent(data.data);
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  useEffect(() => {
    const convoId = localStorage.getItem('convoId');
    if (convoId) {
      localStorage.removeItem('convoId');
    }
  }, [agentId]);

  useEffect(() => {
    function updateScale() {
      if (previewMode === 'desktop') {
        const maxWidth = 900;
        const windowWidth = window.innerWidth;
        const calculatedScale = Math.max((windowWidth - 40) / maxWidth, 0.5);
        setScale(windowWidth < maxWidth ? calculatedScale : 1);
      } else {
        setScale(1);
      }
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [previewMode]);

  useEffect(() => {
    if (!isDialogOpen) setPreviewMode('mobile');
  }, [isDialogOpen]);

  const handleConnect = () => {
    router.push(`/v1/agents/connect/${agentId}`);
  };

  const openDesktopPreview = () => {
    setPreviewMode('desktop');
    setIsDialogOpen(true);
  };

  const openMobilePreview = () => {
    setPreviewMode('mobile');
    setIsDialogOpen(false);
  };

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
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : agent ? (
              <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
                {/* Customization Section */}
                <div className="bg-sidebar flex w-full flex-col justify-between rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-1/3">
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">Customization</h2>
                    <p className="text-muted-foreground">
                      Customize your AI agent&apos;s appearance and behavior to match your brand.
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleConnect}
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
                        key={`${agentId}-mobile`}
                        src={`/${previewHtml}?id=${agentId}`}
                        className="rounded-lg border"
                        title="Chat Preview"
                        style={{
                          width: '375px',
                          height: '100%',
                          transformOrigin: 'top left',
                          transform: 'scale(1)',
                        }}
                      />
                    </div>
                  )}

                  {/* Desktop preview: dialog */}
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
                        key={`${agentId}-desktop`}
                        src={`/${previewHtml}?id=${agentId}`}
                        className="h-full w-full"
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
              </div>
            ) : (
              <div className="bg-sidebar text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border-[0.5px] border-dashed border-gray-400 p-8 text-center">
                <Bot className="text-muted-foreground h-10 w-10" />
                <p className="text-lg font-medium">Agent not found</p>
                <p className="text-sm">Please check the URL and try again.</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
