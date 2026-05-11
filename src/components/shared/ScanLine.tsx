import { motion } from 'framer-motion';

export function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 h-[2px]"
      style={{ background: 'rgba(0,196,232,0.35)', zIndex: 10 }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
    />
  );
}
