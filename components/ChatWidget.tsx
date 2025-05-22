/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Bot,
  MessageCircle,
  ChevronDown,
  Home,
  MessageSquare,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMobile } from '@/hooks/useMobile';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type Tab = 'home' | 'messages' | 'help';

export default function CoucouChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Coucou AI. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot typing
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple bot response generator
  const getBotResponse = (userInput: string): string => {
    const responses = [
      "That's an interesting point! Can you tell me more?",
      'I understand. How can I help you with that?',
      "Thanks for sharing. Is there anything specific you'd like to know?",
      "I'm processing that information. What else would you like to discuss?",
      "That's fascinating! Let's explore this topic further.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const helpArticles = [
    { id: 1, title: 'How to Fix a Network Error in hPanel', url: '#' },
    { id: 2, title: 'Set up Hostinger email on your applications and devices', url: '#' },
    { id: 3, title: 'How to point a domain to Hostinger', url: '#' },
    { id: 4, title: 'How to migrate a website to Hostinger', url: '#' },
  ];

  const helpCollections = [
    {
      id: 1,
      title: 'Getting Started',
      description: 'Things you wish to know before starting your website',
      articles: 39,
    },
    {
      id: 2,
      title: 'hPanel',
      description: 'The features of Hostinger control panel',
      articles: 55,
    },
    {
      id: 3,
      title: 'Website Builder',
      description: 'Everything you need to know about the website builder',
      articles: 248,
    },
    {
      id: 4,
      title: 'Domains',
      description:
        'Useful information about purchasing, transferring and managing your domains at Hostinger',
      articles: 73,
    },
    { id: 5, title: 'DNS', description: "Managing your domain's DNS Zone", articles: 74 },
    {
      id: 6,
      title: 'Files Management',
      description:
        'Information about access to your website files, backups. Also, FTP, SFTP, and SSH access',
      articles: 54,
    },
  ];

  // Render desktop version
  if (!isMobile) {
    return (
      <>
        {/* Floating Chat Button - Always visible */}
        <div className="fixed right-6 bottom-6 z-50">
          <motion.div
            animate={{
              rotate: isChatOpen ? 180 : 0,
              backgroundColor: isChatOpen ? 'rgb(99, 102, 241)' : 'rgb(124, 58, 237)',
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 shadow-lg hover:from-violet-600 hover:to-indigo-700"
            onClick={toggleChat}
          >
            {isChatOpen ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <ChevronDown size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <MessageCircle size={24} className="text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Chat Window */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  mass: 1,
                }}
                className="absolute right-0 bottom-16 mb-2"
              >
                <Card className="w-80 overflow-hidden rounded-2xl border-0 bg-white/90 shadow-xl backdrop-blur-sm md:w-96">
                  <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-white/20 p-1.5">
                          <Bot size={18} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold">Coucou AI</h2>
                      </div>
                      <span className="rounded-full bg-white/20 px-2 py-1 text-xs">Online</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="h-[350px] space-y-4 overflow-y-auto p-4">
                      {messages.map(message => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex max-w-[80%] gap-2">
                            {message.sender === 'bot' && (
                              <Avatar className="mt-1 h-8 w-8">
                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div>
                              <div
                                className={`rounded-2xl p-3 ${
                                  message.sender === 'user'
                                    ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {message.content}
                              </div>
                              <div
                                className={`mt-1 text-xs text-gray-500 ${
                                  message.sender === 'user' ? 'text-right' : 'text-left'
                                }`}
                              >
                                {formatTime(message.timestamp)}
                              </div>
                            </div>

                            {message.sender === 'user' && (
                              <Avatar className="mt-1 h-8 w-8">
                                <AvatarFallback className="bg-violet-100 text-violet-600">
                                  <User size={14} />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex max-w-[80%] gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                AI
                              </AvatarFallback>
                            </Avatar>
                            <div className="rounded-2xl bg-gray-100 p-3 text-gray-800">
                              <div className="flex space-x-1">
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                  style={{ animationDelay: '0ms' }}
                                ></div>
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                  style={{ animationDelay: '150ms' }}
                                ></div>
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                  style={{ animationDelay: '300ms' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>

                  <CardFooter className="border-t p-3">
                    <form
                      className="flex w-full gap-2"
                      onSubmit={e => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                    >
                      <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border-gray-200 focus-visible:ring-violet-500"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
                      >
                        <Send size={18} />
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }

  // Render mobile version (full screen with tabs)
  return (
    <>
      {/* Floating Chat Button - Only when chat is closed */}
      {!isChatOpen && (
        <div className="fixed right-6 bottom-6 z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 shadow-lg"
            onClick={toggleChat}
          >
            <MessageCircle size={24} className="text-white" />
          </motion.div>
        </div>
      )}

      {/* Full Screen Mobile Chat */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col bg-white"
          >
            {/* Home Tab */}
            {activeTab === 'home' && (
              <div className="flex h-full flex-col">
                {/* Header with gradient */}
                <div className="bg-gradient-to-b from-violet-600 to-violet-500 p-4 pb-8 text-white">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/20">
                        <Bot size={16} className="text-white" />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-white hover:bg-white/20"
                      onClick={toggleChat}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                  <h1 className="mb-1 text-2xl font-bold">Hi 👋</h1>
                  <h2 className="mb-6 text-2xl font-bold">How can we help?</h2>

                  <Button
                    variant="outline"
                    className="mb-4 w-full justify-between bg-white text-violet-600 hover:bg-white/90"
                    onClick={() => {
                      setActiveTab('messages');
                      // Clear previous messages and start fresh
                      setMessages([
                        {
                          id: '1',
                          content: "Hello! I'm Coucou AI. How can I assist you today?",
                          sender: 'bot',
                          timestamp: new Date(),
                        },
                      ]);
                    }}
                  >
                    <span>Send us a message</span>
                    <ArrowRight size={18} />
                  </Button>
                </div>

                {/* Search and help articles */}
                <div className="flex-1 overflow-auto px-4 pt-4 pb-16">
                  <div className="relative mb-4">
                    <Input
                      placeholder="Search for help"
                      className="rounded-lg border-gray-200 py-2 pr-4 pl-10"
                    />
                    <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                    {helpArticles.map(article => (
                      <div key={article.id} className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-800">{article.title}</span>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <div>
                      <div className="font-medium">Status: All Systems Operational</div>
                      <div className="text-xs text-gray-500">Updated Apr 19, 22:49 UTC</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setActiveTab('home')}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-violet-100 text-violet-600">
                          <Bot size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">Kodee</h2>
                        <p className="text-xs text-gray-500">The team can also help</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <span className="sr-only">More options</span>
                      <svg
                        width="20"
                        height="4"
                        viewBox="0 0 20 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2H2.01M10 2H10.01M18 2H18.01"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={toggleChat}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 space-y-4 overflow-auto p-4">
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex max-w-[80%] gap-2">
                        {message.sender === 'bot' && (
                          <Avatar className="mt-1 h-8 w-8">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              <Bot size={14} />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div>
                          <div
                            className={`rounded-2xl p-3 ${
                              message.sender === 'user'
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {message.content}
                          </div>
                          <div
                            className={`mt-1 text-xs text-gray-500 ${
                              message.sender === 'user' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>

                        {message.sender === 'user' && (
                          <Avatar className="mt-1 h-8 w-8">
                            <AvatarFallback className="bg-violet-100 text-violet-600">
                              <User size={14} />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex max-w-[80%] gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            <Bot size={14} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl bg-gray-100 p-3 text-gray-800">
                          <div className="flex space-x-1">
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: '0ms' }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: '150ms' }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: '300ms' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-white p-4">
                  <form
                    className="flex w-full gap-2"
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow border-gray-200 focus-visible:ring-violet-500"
                    />
                    <Button type="submit" size="icon" className="bg-violet-600 hover:bg-violet-700">
                      <Send size={18} className="text-white" />
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="text-xl font-bold">Help</h2>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleChat}>
                    <X size={20} />
                  </Button>
                </div>

                {/* Search */}
                <div className="p-4">
                  <div className="relative">
                    <Input
                      placeholder="Search for help"
                      className="rounded-lg border-gray-200 py-2 pr-4 pl-10"
                    />
                    <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Help Collections */}
                <div className="flex-1 overflow-auto px-4 pb-16">
                  <h3 className="mb-4 text-sm font-medium text-gray-500">19 collections</h3>

                  <div className="space-y-4">
                    {helpCollections.map(collection => (
                      <div key={collection.id} className="border-b pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{collection.title}</h4>
                            <p className="text-sm text-gray-600">{collection.description}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {collection.articles} articles
                            </p>
                          </div>
                          <ChevronRight size={20} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 flex items-center justify-around border-t bg-white px-4 py-3">
              <button
                className={`flex flex-col items-center ${activeTab === 'home' ? 'text-violet-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={24} />
                <span className="mt-1 text-xs">Home</span>
              </button>
              <button
                className={`flex flex-col items-center ${activeTab === 'messages' ? 'text-violet-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare size={24} />
                <span className="mt-1 text-xs">Messages</span>
              </button>
              <button
                className={`flex flex-col items-center ${activeTab === 'help' ? 'text-violet-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('help')}
              >
                <HelpCircle size={24} />
                <span className="mt-1 text-xs">Help</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
