'use client';
import BubbleChat from '@/components/chat/BubbleChat';

export default function BubbleIframePage() {
  return (
    
    <div
  style={{
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7f22fe, #22ff9c)',

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

     
  );
}
