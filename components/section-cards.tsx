'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardDescription } from '@/components/ui/card';
import { Bot, PlusCircleIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddBuild } from './forms/Add-build';
import axios from 'axios';

interface Bot {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export function SectionCards() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filterBots = bots.filter(bot => bot.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const getAgents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent`, {
          withCredentials: true,
        });
        setBots((response.data as { data: Bot[] }).data);
      } catch (error) {
        console.error('Failed to fetch bots:', error);
      } finally {
        setLoading(false);
      }
    };
    getAgents();
  }, []);

  const handleBuildSuccess = (id: string) => {
    toast.success('✅ Agent created successfully! Redirecting...');
    setTimeout(() => {
      router.push(`/v1/agents/build/${id}`);
    }, 3000);
  };

  const handleBuildError = () => {
    toast.error('❌ Failed to create agent. Please try again.');
  };

  const deleteBot = async (id: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent/${id}`, {
        withCredentials: true,
      });
      setBots(prev => prev.filter(bot => bot.id !== id));
      toast.success('🗑️ Agent deleted successfully');
    } catch (error) {
      toast.error('❌ Failed to delete agent');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="px-4">
        <Input
          type="text"
          placeholder="🔍 Search builds..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-48 rounded-md px-3 py-1.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 px-3 lg:px-5 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Card className="flex cursor-pointer flex-col items-center justify-center gap-1 py-6 transition-transform hover:scale-105">
              <PlusCircleIcon className="text-muted-foreground h-10 w-10" />
              <p className="text-muted-foreground text-sm">Create your Build</p>
            </Card>
          </DialogTrigger>
          <DialogContent className="w-full !max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Choose your AI chat template</DialogTitle>
              <DialogDescription>
                Select a template to get started quickly with pre-configured settings
              </DialogDescription>
            </DialogHeader>
            <div>
              <AddBuild
                closeDialog={() => setOpen(false)}
                onSuccess={handleBuildSuccess}
                onError={handleBuildError}
              />
            </div>
          </DialogContent>
        </Dialog>

        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Card
                key={i}
                className="flex animate-pulse flex-col items-center justify-center gap-2 py-6"
              >
                <div className="bg-muted mr-10 h-3 w-3 self-end rounded" />
                <div className="bg-muted h-12 w-12 rounded-full" />
                <div className="bg-muted h-3 w-20 rounded" />
                <div className="bg-muted h-2 w-28 rounded" />
              </Card>
            ))
          : filterBots.map(bot => (
              <Card
                key={bot.id}
                className="flex cursor-pointer flex-col items-center justify-center gap-1 py-6 transition-transform hover:scale-105"
              >
                <Dialog
                  open={deletingId === bot.id}
                  onOpenChange={open => !open && setDeletingId(null)}
                >
                  <CardDescription className="mr-10 flex w-full justify-end">
                    <DialogTrigger asChild>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setDeletingId(bot.id);
                        }}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </DialogTrigger>
                  </CardDescription>

                  <DialogContent className="w-full max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete <strong>{bot.name}</strong>?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="border-muted rounded-md border px-3 py-1 text-sm"
                        onClick={() => setDeletingId(null)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => deleteBot(bot.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div
                  className="flex flex-col items-center justify-center gap-1"
                  onClick={() => router.push(`/v1/agents/build/${bot.id}`)}
                >
                  <Bot className="text-primary h-12 w-12" />
                  <p className="text-sm text-white">{bot.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(bot.createdAt), {
                      addSuffix: true,
                    }).replace('about', 'created')}
                  </p>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
