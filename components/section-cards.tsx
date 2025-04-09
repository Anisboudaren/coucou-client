"use client"
import {
  Card,
  CardDescription,
} from "@/components/ui/card"
import { Bot , PlusCircleIcon, Trash2 } from "lucide-react"
import { useState } from "react";
import { Input } from "./ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog";
import { AddBuild } from "./forms/Add-build";


export function SectionCards() {
  const [search , setSearch ] = useState("");


  const bots = [
    { id: "a7f3b9c21d8e6f4a", name: "Test bot #1" },
    { id: "a7f3b9c21d8e6f4b", name: "Test bot #2" },
    { id: "a7f3b9c21d8e6f4c", name: "Test bot #3" },
    { id: "a7f3b9c21d8e6f4d", name: "Test bot #4" },
    { id: "a7f3b9c21d8e6f4e", name: "Test bot #5" },
    { id: "a7f3b9c21d8e6f4f", name: "Test bot #6" },
   
   
    
  ]
  

  const filterBots = bots.filter(bot => bot.name.toLowerCase().includes(search.toLowerCase()))


  return (

    <div className="flex flex-col gap-4 ">
      <div className="px-6">
      
      <Input type="text" placeholder="🤖 search Agents builds..." value={search}
      onChange={e => {
        setSearch(e.target.value)
      }}
      className="w-64 border-muted rounded-md px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
      />
      </div>
      
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
     
      <Dialog >
        <DialogTrigger asChild>
          {/* the create your build card */}
            <Card 
          className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center justify-center gap-2 py-8">
          <PlusCircleIcon className="w-14 h-14 text-muted-foreground " />
          <p className="text-sm text-muted-foreground">Create your Build</p>
          </Card>
        </DialogTrigger>

      <DialogContent className="!max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Choose your AI chat template</DialogTitle>
          <DialogDescription>
            Select a template to get started uickly with pre-configured settings 
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddBuild />
        </div>
      </DialogContent>
    </Dialog>
    
     

      {filterBots.map(bot => {
        return <Card key={bot.id} className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center justify-center gap-2 py-8">
        <CardDescription className="flex w-full mr-12 justify-end "><Trash2 className="w-4 h-4 text-"/></CardDescription>
        <Bot className="w-16 h-16 text-primary " />
        <p className="text-sm text-white">{bot.name}</p>
        <p className="text-sm text-muted-foreground">ID: {bot.id}</p>
        </Card>
      })}
      

      
     
    </div>
    </div>
    
  )
}
