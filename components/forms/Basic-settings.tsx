/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';

import { Separator } from '../ui/separator';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';

import { UseFormReturn } from 'react-hook-form';

interface BasicSettingsProps {
  form: UseFormReturn<any>; // Replace 'any' with your form's type if available
}

export function BasicSettings({ form }: BasicSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        {/* AI Name Field */}
        <FormField
          control={form.control}
          name="aiName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Name</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sales Assistant" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Template Selection Field */}
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick a Template</FormLabel>
              <FormControl>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales AI</SelectItem>
                    <SelectItem value="support">Support AI</SelectItem>
                    <SelectItem value="blank">Start Blank</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Model Selection Field */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Select a Model</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="deepseek-v1">DeepSeek v1</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Separator />

        <Collapsible open={isOpen} onOpenChange={handleToggle}>
          <CollapsibleTrigger className="text-muted-foreground mb-4 flex cursor-pointer items-center space-x-2">
            <span>Advanced settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transform transition-transform duration-700 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={`max-h-0 space-y-6 overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-96' : ''}`}
          >
            {/* Message Length Field */}
            <FormField
              control={form.control}
              name="messageLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Length Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter message length limit" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Allow Human Agent Toggle */}
            <FormField
              control={form.control}
              name="allowHumanAgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      defaultChecked={true}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Allow Client to Request Human Agent</FormLabel>
                    <FormDescription>This is activated by Default for all agents.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>
      </form>
    </Form>
  );
}
