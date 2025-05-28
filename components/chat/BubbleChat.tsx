'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const BubbleChat = () => {
  return (
    <motion.div
      className="cursor-pointer bg-transparent pb-1"
      whileTap={{ scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.2 }}
    >
      <Image src="/logos/coucou-logo-white.png" alt="Coucou Logo" width={50} height={55} priority />
    </motion.div>
  );
};

export default BubbleChat;
