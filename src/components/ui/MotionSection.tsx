'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MotionSectionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
