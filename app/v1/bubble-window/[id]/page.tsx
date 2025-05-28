/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type React from 'react';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Maximize2, Paperclip, Calendar, Smile } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BubbleIframePage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [agentName, setAgentName] = useState('Fin');

  const params = useParams();
  const agentId = params.id;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    window.parent.postMessage({ message: 'closeChat' }, '*');
  };

  const typeText = (text: string) => {
    let index = 0;
    setTypingMessage('');
    const interval = setInterval(() => {
      setTypingMessage(prev => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 20);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const storedConvoId = localStorage.getItem('convoId');
    const storedExpiration = localStorage.getItem('convoIdExpiration');
    const isExpired = storedExpiration && Date.now() > Number.parseInt(storedExpiration, 10);

    if (!storedConvoId || isExpired) {
      if (isExpired) {
        localStorage.removeItem('convoId');
        localStorage.removeItem('convoIdExpiration');
      }
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/conversation/init`,
          {
            agentId: agentId,
            firstMessage: input,
          },
        );

        const newConvoId = (res.data as { id: string }).id;
        const expirationTime = Date.now() + 1000 * 60 * 30;
        localStorage.setItem('convoId', newConvoId);
        localStorage.setItem('convoIdExpiration', expirationTime.toString());

        const sendRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/conversation/send`,
          {
            conversationId: newConvoId,
            message: input,
          },
        );

        const sendData = sendRes.data as { agentMessage: { message: string } };
        const reply = sendData.agentMessage.message;
        typeText(reply);
        setTimeout(
          () => {
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setTypingMessage('');
          },
          reply.length * 20 + 300,
        );
      } catch (err) {
        console.error(err);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Error contacting the assistant.' },
        ]);
      }
    } else {
      const storedConvoId = localStorage.getItem('convoId')!;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/conversation/send`,
        {
          conversationId: storedConvoId,
          message: input,
        },
      );

      const data = res.data as { agentMessage: { message: string } };
      const reply = data.agentMessage.message;
      typeText(reply);
      setTimeout(
        () => {
          setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
          setTypingMessage('');
        },
        reply.length * 20 + 300,
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    if (params?.id && typeof params.id === 'string') {
      setAgentName(`${params.id.slice(0, 8)}`);
    }
  }, [params]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('convoId');
      const storedExpiration = localStorage.getItem('convoIdExpiration');
      const isExpired = storedExpiration && Date.now() > Number.parseInt(storedExpiration, 10);

      if (!storedId || isExpired) {
        localStorage.removeItem('convoId');
        localStorage.removeItem('convoIdExpiration');
      }
    }
  }, []);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi there, you're speaking with ${agentName} AI Agent.\n\nHow can I help?`,
        },
      ]);
    }
  }, [agentName]);

  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom when messages change, but only if user hasn't scrolled up
  useEffect(() => {
    if (messagesEndRef.current && shouldAutoScroll) {
      const element = messagesEndRef.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typingMessage, shouldAutoScroll]);

  // Force scroll to bottom when agent starts typing (override user scroll)
  useEffect(() => {
    if (typingMessage && messagesEndRef.current) {
      const element = messagesEndRef.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
      setShouldAutoScroll(true);
    }
  }, [typingMessage]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className="h-8 w-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {/* Logo/Icon */}
            <div className="flex h-8 w-8 items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-black" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 22L12 18.27L5.82 22L7 14.74L2 9L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <h1 className="font-medium text-gray-900">{agentName}</h1>
              <p className="text-sm text-gray-500">The team can also help</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-900">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={messagesEndRef}
          className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full h-full overflow-y-auto px-4 py-6"
          style={{
            maxHeight: 'calc(100vh - 140px)',
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
          }}
          onScroll={e => {
            const element = e.currentTarget;
            const isAtBottom =
              element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
            setIsUserScrolling(!isAtBottom);
            setShouldAutoScroll(isAtBottom);
          }}
        >
          <div className="max-w-2xl space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-5 w-5 items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 22L12 18.27L5.82 22L7 14.74L2 9L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">{agentName} - AI Agent</span>
                  </div>
                )}
                <div className={`${msg.role === 'user' ? 'ml-auto max-w-xs' : 'max-w-full'}`}>
                  <div
                    className={`rounded-lg p-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'ml-auto bg-blue-500 text-white'
                        : 'border border-gray-200 bg-white text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {typingMessage && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-5 w-5 items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 22L12 18.27L5.82 22L7 14.74L2 9L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">{agentName} - AI Agent</span>
                </div>
                <div className="max-w-full">
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-900">
                    <p className="whitespace-pre-line">{typingMessage}</p>
                    {typingMessage && (
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-1 w-1 animate-pulse rounded-full bg-gray-400"></div>
                        <div className="animation-delay-200 h-1 w-1 animate-pulse rounded-full bg-gray-400"></div>
                        <div className="animation-delay-400 h-1 w-1 animate-pulse rounded-full bg-gray-400"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {loading && !typingMessage && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-5 w-5 items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 22L12 18.27L5.82 22L7 14.74L2 9L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">{agentName} - AI Agent</span>
                </div>
                <div className="max-w-full">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div className="animation-delay-100 h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div className="animation-delay-200 h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      </div>
                      <span>Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="border-gray-300 pr-24 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
              disabled={loading}
            />
            <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Footer disclaimer */}
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          By chatting with us, you agree to the monitoring and recording of this chat to improve our
          service and processing of your personal data in accordance with our Privacy Policy.{' '}
          <button className="underline hover:no-underline">See our Privacy Policy</button>.
        </p>
      </div>
    </div>
  );
};

export default BubbleIframePage;
