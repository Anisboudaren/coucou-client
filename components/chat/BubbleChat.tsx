// BubbleChat.tsx
'use client';

import { motion } from 'framer-motion';
import { MessageCircleCodeIcon } from 'lucide-react';
import React from 'react';

const BubbleChat = () => {
  return (
    <motion.div
      className="h-full cursor-pointer bg-transparent"
      //   whileHover={{ rotate: 360 }}
      whileTap={{ scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <MessageCircleCodeIcon fontWeight={100} width={48} height={48} color="white" />
    </motion.div>
  );
};

export default BubbleChat;
