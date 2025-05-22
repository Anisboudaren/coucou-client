'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { BasicSettings } from '@/components/forms/Basic-settings';
import { BuildConfiguration } from '@/components/forms/Configurations';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Agent } from '@/types/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Bot } from 'lucide-react'; // Lucide bot icon

const formSchema = z.object({
  aiName: z.string().min(2),
  template: z.string(),
  model: z.string(),
  messageLength: z.number().min(0).optional(),
  allowHumanAgent: z.boolean().optional(),
});

const personalitySchema = z.object({
  primaryTraits: z.array(z.string()).min(1, {
    message: 'Select at least one personality trait',
  }),
  communicationTone: z.string(),
  formalityLevel: z.number(),
  primaryFunction: z.string(),
  brandValues: z.string().optional(),
});

const knowledgeSchema = z.object({
  rules: z.string().min(1, 'Rules are required'),
  companyInformation: z.string().min(1, 'Company information is required'),
});

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aiName: agent?.name || '',
      template: 'support',
      model: 'deepseek-v1',
      messageLength: 500,
      allowHumanAgent: true,
    },
  });

  const personalityForm = useForm({
    resolver: zodResolver(personalitySchema),
    defaultValues: {
      primaryTraits: [],
      communicationTone: 'conversational',
      formalityLevel: 1,
      primaryFunction: '',
      brandValues: '',
    },
  });

  const knowledgeForm = useForm({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      rules: '',
      companyInformation: '',
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const [isPersonalityValid, isKnowledgeValid] = await Promise.all([
        personalityForm.trigger(),
        knowledgeForm.trigger(),
      ]);

      if (!isPersonalityValid || !isKnowledgeValid) {
        toast.error('Please fix the errors in the forms before submitting.');
        setIsSubmitting(false);
        return;
      }

      const personalityValues = personalityForm.getValues();
      const knowledgeValues = knowledgeForm.getValues();
      const BasicSettings = form.getValues();
      const agentId = params.id;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent/${agentId}/build`,
        {
          ...BasicSettings,
          ...personalityValues,
          ...knowledgeValues,
        },
        { withCredentials: true },
      );

      toast.success('Build saved successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/v1/agents/test/${agentId}`);
      }, 3000);
    } catch (error) {
      console.error('Failed to save build:', error);
      toast.error('Failed to save build. Please try again.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getAgent = async () => {
      const agentId = params.id;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent/${agentId}`,
          { withCredentials: true },
        );
        const agentData = response.data as { data: Agent };
        setAgent(agentData.data);
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      } finally {
        setLoading(false);
      }
    };
    getAgent();
  }, [params.id]);

  useEffect(() => {
    if (agent) {
      form.reset({ aiName: agent.name || '' });
    }
  }, [agent, form]);

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
                <h1 className="text-2xl font-semibold">Edit Your AI Build</h1>
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex h-full flex-col gap-4 md:flex-row">
                <div className="bg-sidebar w-full rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-1/3">
                  <h2 className="mb-4 text-xl font-semibold">Basic Settings</h2>
                  <BasicSettings form={form} />
                </div>

                <div className="bg-sidebar w-full rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-2/3">
                  <h2 className="mb-4 text-xl font-semibold">Additional Settings</h2>
                  <BuildConfiguration
                    personalityForm={personalityForm}
                    knowledgeForm={knowledgeForm}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full page overlay while submitting */}
        {isSubmitting && (
          <div className="bg-opacity-40 fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <Bot
              className="text-primary mb-6 h-16 w-16 animate-[jump_1.5s_ease-in-out_infinite]"
              strokeWidth={1.5}
            />
            <p className="mb-2 text-lg font-semibold text-white">
              Your agent is building
              <AnimatedDots />
            </p>
          </div>
        )}
      </SidebarInset>

      {/* Jump animation keyframes */}
      <style jsx global>{`
        @keyframes jump {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15%);
          }
        }
      `}</style>
    </SidebarProvider>
  );
}

// Animated dots component
function AnimatedDots() {
  return (
    <span className="ml-2 inline-block">
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </span>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full bg-white opacity-50"
      style={{
        animation: `blink 1.2s infinite`,
        animationDelay: `${delay}ms`,
        marginLeft: 4,
      }}
    />
  );
}

// Dots blink animation
const style = `
@keyframes blink {
  0%, 80%, 100% {
    opacity: 0.5;
  }
  40% {
    opacity: 1;
  }
}
`;

// Append blink animation to document head
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
}
