"use client"
import ChatWidget from '@/components/ChatWidget'
import React from 'react'
import Head from 'next/head'

const Chat = () => {
    return (
    <>
      <Head>
        <style>{`
          html, body, #__next {
            background: transparent !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
        `}</style>
      </Head>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      >
        <ChatWidget />

      </div>
    </>
  );
}

export default Chat