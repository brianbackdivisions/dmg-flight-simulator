import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface DataSourceNodeProps {
  icon: LucideIcon;
  label: string;
  subtext: string;
  active?: boolean;
  delay?: number;
}

export function DataSourceNode({ icon: Icon, label, subtext, active, delay = 0 }: DataSourceNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`card px-4 py-3 flex flex-col items-center text-center gap-1.5 transition-all duration-300 min-w-[160px] ${
        active ? 'glow-ai' : ''
      }`}
    >
      <Icon
        size={20}
        className={`transition-colors duration-300 ${active ? 'text-accent-ai' : 'text-text-tertiary'}`}
      />
      <span className="font-mono text-[11px] text-text-primary uppercase tracking-wider leading-tight">
        {label}
      </span>
      <span className="font-sans text-[11px] text-text-tertiary leading-tight">{subtext}</span>
    </motion.div>
  );
}
