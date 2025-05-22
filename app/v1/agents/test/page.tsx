'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import React, { useState } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(false);

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
                <h1 className="text-2xl font-semibold">Tets Your AI Build</h1>
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex h-full flex-col gap-4 md:flex-row">
                <div className="bg-sidebar w-full rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-1/3">
                  <h2 className="mb-4 text-xl font-semibold">Customization</h2>
                </div>

                <div className="bg-sidebar w-full rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-2/3">
                  <h2 className="mb-4 text-xl font-semibold">Preview</h2>
                  <div className="relative"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
