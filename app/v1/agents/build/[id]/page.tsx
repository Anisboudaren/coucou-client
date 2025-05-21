'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { BasicSettings } from '@/components/forms/Basic-settings';
import { BuildConfiguration } from '@/components/forms/Configurations';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface Agent {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  settings: {
    model: string;
  };
}
export default function Page() {
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const params = useParams();
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getAgent = async () => {
      const agentId = params.id;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent/${agentId}`,
          {
            withCredentials: true,
          },
        );
        const agentData = response.data as { data: Agent };
        console.log('Agent data:', agentData.data);
        setAgent(agentData.data);
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      } finally {
        setLoading(false);
      }
    };
    getAgent();
  }, []);

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
      <SidebarInset className="pb-14">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4 md:px-6">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-2">
                <h1 className="text-2xl font-semibold">Edit Your AI Build</h1>
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="bg-sidebar w-full rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-1/3">
                  <h2 className="mb-4 text-xl font-semibold">Basic Settings</h2>
                  <BasicSettings agent={agent} />
                </div>

                <div className="bg-sidebar w-full rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-2/3">
                  <h2 className="mb-4 text-xl font-semibold">Additional Settings</h2>
                  <BuildConfiguration />
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
