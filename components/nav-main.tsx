'use client';

import { useState } from 'react';
import { IconCirclePlusFilled, type Icon } from '@tabler/icons-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'; // your dialog components

import { AddBuild } from '@/components/forms/Quick-Add-build'; // import your AddBuild component

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* DialogTrigger wraps the Quick Create button */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary/90 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DialogTrigger>

              <DialogContent className="w-full !max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Choose your AI chat template</DialogTitle>
                  <DialogDescription>
                    Select a template to get started quickly with pre-configured settings
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <AddBuild closeDialog={() => setOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <a href={item.url}>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
