'use client';
import { useState, useEffect } from 'react';

const rotatingWords = [
  'FAQ',
  'return Policy',
  'Products',
  'Information',
  'Shipping',
  'Order Status',
];

export default function AnimatedInputBar() {
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex <= rotatingWords[wordIndex].length) {
      // Typing forward
      setDisplayedText(rotatingWords[wordIndex].substring(0, charIndex));
      timeout = setTimeout(() => setCharIndex(charIndex + 1), typingSpeed);
    } else if (isDeleting && charIndex >= 0) {
      // Deleting
      setDisplayedText(rotatingWords[wordIndex].substring(0, charIndex));
      timeout = setTimeout(() => setCharIndex(charIndex - 1), deletingSpeed);
    } else if (charIndex === rotatingWords[wordIndex].length + 1) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (charIndex === -1) {
      // Move to next word
      setIsDeleting(false);
      setWordIndex((wordIndex + 1) % rotatingWords.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className="flex w-[450px] items-center gap-4 rounded-2xl bg-[#FCFBF8D9]/85 px-4 py-4 shadow-xl">
      <div className="flex-1">
        <p className="text-base text-black">
          <span className="font-base">Ask Coucou for help with </span>
          <span className="relative inline-block min-w-[80px] text-base">
            {displayedText}
            <span
              className="animate-blink absolute top-1/2 ml-[2px] inline-block h-[1.4em] w-[2px] -translate-y-1/2 bg-[#1F68DB]"
              aria-hidden="true"
            />
          </span>
        </p>
      </div>
      <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 transition hover:bg-gray-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </div>
    </div>
  );
}
