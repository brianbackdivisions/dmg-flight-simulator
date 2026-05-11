import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ProviderScore } from '@/data/types';
import { BEHAVIOR_LABEL_MAP } from '@/data/types';

interface Props {
  providers: ProviderScore[];
  totalMatched?: number;
}

export function FullProviderList({ providers }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <span className="font-sans text-[13px] text-text-secondary underline">
          View all {providers.length} matched providers
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
            <div className="border-t border-border-subtle overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    {['Rank', 'Provider', 'Top Signal', 'Match Score', 'Distance', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left font-mono text-[10px] text-text-tertiary uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p, i) => {
                    const isTop5 = i < 5;
                    const topLabel = p.behavior_labels?.[0]
                      ? BEHAVIOR_LABEL_MAP[p.behavior_labels[0]] ?? p.behavior_labels[0].toUpperCase()
                      : '—';
                    return (
                      <tr
                        key={p.provider_id}
                        className={`border-b border-border-subtle hover:bg-bg-surface2 transition-colors ${
                          isTop5 ? 'border-l-2 border-l-accent-ai' : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 font-mono text-[12px] text-text-tertiary">{i + 1}</td>
                        <td className="px-4 py-2.5 font-sans text-[13px] text-text-primary">{p.provider_name}</td>
                        <td className="px-4 py-2.5">
                          {topLabel !== '—' ? (
                            <span className="font-mono text-[10px] text-accent-ai uppercase">{topLabel}</span>
                          ) : (
                            <span className="font-mono text-[10px] text-text-tertiary">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-bg-surface2">
                              <div
                                className="h-full rounded-full bg-accent-ai"
                                style={{ width: `${p.score}%` }}
                              />
                            </div>
                            <span className="font-mono text-[12px] text-text-primary">{p.score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[12px] text-text-secondary">
                          {p.provider_property_distance_in_miles} mi
                        </td>
                        <td className="px-4 py-2.5">
                          {p.is_provider_recommended_for_job ? (
                            <span className="font-mono text-[10px] text-accent-ai uppercase">AI Pick</span>
                          ) : (
                            <span className="font-mono text-[10px] text-text-tertiary uppercase">Qualified</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
