import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FiltrationStat } from '@/data/types';

interface Props {
  stats: FiltrationStat[];
}

export function FiltrationPanel({ stats }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
          Why some providers weren't shown
        </span>
        <ChevronDown
          size={13}
          className={`text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-border-subtle pt-3 space-y-2">
              {stats.map((stat) => (
                <div key={stat.reason} className="flex items-center justify-between">
                  <span className="font-mono text-[12px] text-text-tertiary uppercase tracking-wider">
                    {stat.reason}
                  </span>
                  <span className="font-mono text-[13px] text-text-primary">{stat.count} providers excluded</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
