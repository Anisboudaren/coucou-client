"use client";
// pages/launcher.tsx
export default function Launcher() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => parent.postMessage('open-chat', '*')}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Chat
        </button>
      </div>
    );
  }
  