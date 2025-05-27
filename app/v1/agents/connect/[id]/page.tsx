/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';
import { IntegrationPlatformCards } from '@/components/section-cards-platforms';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const agentId = params.id as string;

  const scriptSnippet = `<script 
  src="http://localhost:3000/scripts/bubble.js" 
  data-agent-id="${agentId}"
  defer
></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptSnippet);
      toast.success('Snippet copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
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
              <div className="px-2">
                <h1 className="text-2xl font-semibold">Integrate Your AI Agent</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Copy the following script and paste it before the closing <code>{'</body>'}</code>{' '}
                  tag of your website.
                </p>
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex h-full flex-col gap-4 md:flex-row">
                <div className="bg-sidebar flex w-full flex-col rounded-2xl border-[0.5px] border-gray-400 p-6">
                  <div className="flex-grow">
                    {/* You could load iframe preview of their bot or instructions */}
                    <div className="text-muted-foreground text-sm">
                      <IntegrationPlatformCards script={scriptSnippet} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
