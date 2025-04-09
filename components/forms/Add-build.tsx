"use client"

import { useState } from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Bot, MessageSquare, PlusCircle } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(2),
  language: z.enum(["english", "french", "arabic", "darja"]),
  template: z.enum(["sales", "support", "blank"]),
})

export function AddBuild() {
  const [selectedTemplate, setSelectedTemplate] = useState("sales")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      language: "english",
      template: "sales",
    },
  })

  const onSubmit = (values: any) => {
    console.log(values)
  }

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
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
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
                defaultValue="english"
                className="flex flex-wrap gap-4"
            >
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2">
                    <RadioGroupItem  value="english" />
                    English
                  </label>
                  <label className="flex items-center gap-2">
                    <RadioGroupItem value="french"  />
                    French
                  </label>
                  <label className="flex items-center gap-2">
                    <RadioGroupItem  value="arabic"/>
                    Arabic
                  </label>
                  <label className="flex items-center gap-2">
                    <RadioGroupItem  value="darja" />
                    Darja <Badge variant="outline">Beta</Badge>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card
                    onClick={() => {
                      form.setValue("template", "sales")
                      setSelectedTemplate("sales")
                    }}
                    className={`flex flex-col cursor-pointer transition-all hover:scale-105  ${
                      selectedTemplate === "sales" ? "border-primary" : ""
                    }`}
                  >
                    <CardHeader className="flex flex-col items-center justify-center text-center">
                      <Bot className="w-8 h-8 text-primary" />
                      <CardTitle>Sales AI</CardTitle>
                      <CardDescription>Assist customers with buying</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    onClick={() => {
                      form.setValue("template", "support")
                      setSelectedTemplate("support")
                    }}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate === "support" ? "border-primary" : ""
                    }`}
                  >
                    <CardHeader className="flex flex-col items-center text-center">
                      <MessageSquare className="w-8 h-8 text-primary" />
                      <CardTitle>Support AI</CardTitle>
                      <CardDescription>Answer common questions</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    onClick={() => {
                      form.setValue("template", "blank")
                      setSelectedTemplate("blank")
                    }}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate === "blank" ? "border-primary" : ""
                    }`}
                  >
                    <CardHeader className=" flex flex-col items-center text-center">
                      <PlusCircle className="w-8 h-8 text-primary" />
                      <CardTitle>Start Blank</CardTitle>
                      <CardDescription >Build from scratch with full control.</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full cursor-pointer" >
        <Link href="/agents/build/devlly">Continue</Link>
        </Button>
      </form>
    </Form>
  )
}
