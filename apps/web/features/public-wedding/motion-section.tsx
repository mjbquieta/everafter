'use client';

import { motion } from 'framer-motion';

interface MotionSectionProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function MotionSection({ children, enabled = true }: MotionSectionProps) {
  if (!enabled) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}
