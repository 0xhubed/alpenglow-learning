'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isGlass?: boolean;
  isHoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isGlass = false,
  isHoverable = false,
  onClick,
}) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  const glassClasses = isGlass
    ? 'glass-effect'
    : 'bg-white shadow-lg';
  const hoverableClasses = isHoverable
    ? 'cursor-pointer hover:shadow-xl hover:transform hover:scale-105'
    : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${baseClasses} ${glassClasses} ${hoverableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;