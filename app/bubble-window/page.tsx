'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';

const BubbleIframePage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    window.parent.postMessage({ message: 'closeChat' }, '*');
    console.log('clicked');
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
          Authorization: 'Bearer sk-c961a411bc0e4959a05face4be26dbce', // Replace this with your key
        },
        body: JSON.stringify({
          model: 'deepseek-chat', // or the correct model ID from DeepSeek
          messages: [...messages, userMessage].slice(-5), // Send last few messages for context
        }),
      });

      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || 'Error: no reply';

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting DeepSeek.' }]);
    }

    setLoading(false);
  };

  return (
    <html>
      <body>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#FFCAD4',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <XCircle color="white" width={38} height={38} onClick={handleClick} />
          </div>

          <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <strong>{msg.role === 'user' ? 'You' : 'DeepSeek'}:</strong>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '1rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </body>
    </html>
  );
};

export default BubbleIframePage;
