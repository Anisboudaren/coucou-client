'use client';
import BubbleChat from '@/components/chat/BubbleChat';

export default function BubbleIframePage() {
  return (
    <html style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <body
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '50%',
            backgroundColor: '#F4ACB7',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => {
            window.parent.postMessage({ message: 'openChat' }, '*');
            console.log('clicked');
          }}
        >
          <BubbleChat />
        </div>
      </body>
    </html>
  );
}
