'use client';

import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
const BubbleIframePage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');

  const params = useParams();

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
    const storedConvoId = localStorage.getItem('convoId');
    const storedExpiration = localStorage.getItem('convoIdExpiration');

    const isExpired = storedExpiration && Date.now() > parseInt(storedExpiration, 10);
    // just test
    // here we check if the localstorage have the convoId if yest we skip if not we init
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
        const expirationTime = Date.now() + 1000 * 60 * 30; // 30 minutes expiration
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
          { role: 'assistant', content: 'Error contacting DeepSeek.' },
        ]);
      }
    } else {
      // in case already convoID we just go with this... hope that works
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
      console.log(params.id);

      // setAgentId(params.id);
    }
  }, [params]);

  useEffect(() => {
    console.log('params:', params);
  }, [params]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('convoId');
      const storedExpiration = localStorage.getItem('convoIdExpiration');

      const isExpired = storedExpiration && Date.now() > parseInt(storedExpiration, 10);

      if (!storedId || isExpired) {
        console.log('🗑️ Conversation expired or missing. Clearing localStorage...');
        localStorage.removeItem('convoId');
        localStorage.removeItem('convoIdExpiration');
      } else {
        console.log('✅ Existing convoId is valid:', storedId);
      }
    }
  }, []);

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
