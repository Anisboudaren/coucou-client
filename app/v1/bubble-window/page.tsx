'use client';

import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
const BubbleIframePage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  // const [agentId, setAgentId] = useState('');
  const params = useParams();
  console.log(window.location.href);
  const agentId = params.id;
  console.log('Agent ID inside bubble-window:', agentId);
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
    }, 20); // typing speed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk-c961a411bc0e4959a05face4be26dbce', // Replace this with your actual key
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [...messages, userMessage].slice(-5),
        }),
      });

      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || 'Error: no reply';
      typeText(botReply);

      setTimeout(
        () => {
          setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
          setTypingMessage('');
        },
        botReply.length * 20 + 300,
      ); // wait until typing animation ends
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting DeepSeek.' }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (params?.id && typeof params.id === 'string') {
      console.log(params.id);

      // setAgentId(params.id);
    }
  }, [params]);

  useEffect(() => {
    console.log('params:', params);
  }, [params]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Close Button */}
      <div className="absolute top-4 right-4">
        <XCircle
          className="cursor-pointer text-violet-500 transition hover:text-violet-800"
          size={36}
          onClick={handleClick}
        />
      </div>

      {/* Messages */}
      <div className="mt-14 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] rounded-lg p-3 ${
              msg.role === 'user'
                ? 'ml-auto self-end bg-violet-100 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            <div className="text-sm text-gray-700">{msg.content}</div>
          </div>
        ))}
        {typingMessage && (
          <div className="max-w-[75%] rounded-lg bg-gray-100 p-3 text-left">
            <div className="text-sm whitespace-pre-line text-gray-700">{typingMessage}</div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4">
        <input
          className="flex-1 rounded-lg border border-gray-300 p-2 text-black focus:ring-2 focus:ring-violet-500 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[linear-gradient(155deg,_#7f22fe,_#22ff9c)] px-4 py-2 text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default BubbleIframePage;
