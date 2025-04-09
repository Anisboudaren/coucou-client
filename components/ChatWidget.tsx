import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Toggle chat window visibility
  const toggleChat = () => setIsOpen(!isOpen);

  // Send a message (static reply)
  const sendMessage = () => {
    if (!message.trim()) return;

    // Add the user's message
    setMessages([...messages, { text: message, sender: 'user' }]);

    // Clear the message input
    setMessage('');

    // Static reply (no API)
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: 'Thank you for reaching out! How can I assist you today?', sender: 'bot' },
    ]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <Button
        onClick={toggleChat}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          padding: '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        💬
      </Button>

      {isOpen && (
        <Card
          style={{
            width: '300px',
            height: '400px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            position: 'absolute',
            bottom: '80px',
            right: '0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '10px',
              maxHeight: '250px',
              paddingRight: '8px',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  padding: '5px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#f0f0f0',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  marginLeft: msg.sender === 'user' ? 'auto' : '0',
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <Button
              onClick={sendMessage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '8px',
              }}
            >
              Send
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
