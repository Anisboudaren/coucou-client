'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Page() {
  const bubbleRef = useRef<HTMLIFrameElement>(null);
  const bubbleWindowRef = useRef<HTMLIFrameElement>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('event', event);

      if (event.data.message === 'openChat') {
        console.log('openChat');
        // Trigger the visibility change
        setIsChatVisible(true);
      } else if (event.data.message === 'closeChat') {
        console.log('closeChat');
        // Trigger the visibility change
        setIsChatVisible(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <h1>Main Page</h1>

      {/* Bubble Chat Icon */}
      <iframe
        ref={bubbleRef}
        src="../bubble"
        width="70"
        height="70"
        style={{
          border: 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',

          zIndex: 9999,
          overflow: 'hidden',
        }}
      />

      {/* Chat Window */}
      <motion.iframe
        ref={bubbleWindowRef}
        src="../bubble-window"
        width="100%" // Ensure full width
        height="100%" // Ensure full height
        style={{
          border: 'none',
          position: 'fixed',
          top: '0px',
          left: '0px',
          backgroundColor: 'black',
          zIndex: 9999,
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, y: '100vh' }} // Initial position off-screen
        animate={{ opacity: isChatVisible ? 1 : 0, y: isChatVisible ? 0 : '100vh' }} // Animate to show or hide
        transition={{ duration: 0.5 }} // Duration of the animation
      />
    </div>
  );
}
