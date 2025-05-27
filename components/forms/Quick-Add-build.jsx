'use client';

import { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Bot, MessageSquare, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  language: z.enum(['english', 'french', 'arabic', 'darja']),
  template: z.enum(['sales', 'support', 'blank']),
});

export function AddBuild({ closeDialog }) {
  const [selectedTemplate, setSelectedTemplate] = useState('support');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      language: 'english',
      template: 'support',
    },
  });

  const onSubmit = async values => {
    console.log('Form submitted:', values);

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/agent/add`,
        values,
        { withCredentials: true },
      );

      const createdAgent = response.data?.data;

      closeDialog();
      if (createdAgent.id) {
        toast.success('AI Build created successfully!');
        toast.info('redirecting to your new AI Build...');
        setTimeout(() => {
          router.push(`/v1/agents/build/${createdAgent.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Give a name to your AI Build</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sales Assistant" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Ex: E-commerce" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="english" />
                      English
                    </label>
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="french" />
                      French
                    </label>
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="arabic" />
                      Arabic
                    </label>
                    <label className="text-muted-foreground flex items-center gap-2">
                      <RadioGroupItem value="darja" disabled />
                      Darja{' '}
                      <div className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                        Coming Soon
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick a Template</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Disabled: Sales AI */}
                  <div className="relative">
                    <Card
                      className={`flex cursor-not-allowed flex-col opacity-50 transition-all ${
                        selectedTemplate === 'sales' ? 'border-primary' : ''
                      }`}
                    >
                      <div className="bg-muted text-foreground absolute top-2 right-2 rounded-full px-2 py-1 text-xs">
                        Coming Soon
                      </div>
                      <CardHeader className="flex flex-col items-center justify-center text-center">
                        <Bot className="text-primary h-8 w-8" />
                        <CardTitle>Sales AI</CardTitle>
                        <CardDescription>Assist customers with buying</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Active: Support AI */}
                  <Card
                    onClick={() => {
                      form.setValue('template', 'support');
                      setSelectedTemplate('support');
                    }}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate === 'support' ? 'border-primary' : ''
                    }`}
                  >
                    <CardHeader className="flex flex-col items-center text-center">
                      <MessageSquare className="text-primary h-8 w-8" />
                      <CardTitle>Support AI</CardTitle>
                      <CardDescription>Answer common questions</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Disabled: Start Blank */}
                  <div className="relative">
                    <Card
                      className={`flex cursor-not-allowed flex-col opacity-50 transition-all ${
                        selectedTemplate === 'blank' ? 'border-primary' : ''
                      }`}
                    >
                      <div className="bg-muted text-foreground absolute top-2 right-2 rounded-full px-2 py-1 text-xs">
                        Coming Soon
                      </div>
                      <CardHeader className="flex flex-col items-center text-center">
                        <PlusCircle className="text-primary h-8 w-8" />
                        <CardTitle>Start Blank</CardTitle>
                        <CardDescription>Build from scratch with full control.</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Building...
            </span>
          ) : (
            'Create Build'
          )}
        </Button>
      </form>
    </Form>
  );
}
