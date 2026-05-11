import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { WorkAction } from '@/data/types';
import { WorkActionType, WORK_ACTION_TYPE_LABELS } from '@/data/types';

interface TaskCardProps {
  action: WorkAction;
  index: number;
  delay?: number;
}

export function TaskCard({ action, index, delay = 0 }: TaskCardProps) {
  const [open, setOpen] = useState(true);

  const typeVariant =
    action.type === WorkActionType.WORK_ACTION_TYPE_ESSENTIAL
      ? 'warn'
      : action.type === WorkActionType.WORK_ACTION_TYPE_AUXILIARY
      ? 'ai'
      : 'slate';

  const typeLabel = WORK_ACTION_TYPE_LABELS[action.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
    >
      <button
        className="w-full flex items-start gap-4 p-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-mono text-[24px] text-text-tertiary leading-none shrink-0 w-8 text-right mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-sans text-[15px] font-500 text-text-primary">
              {action.description}
            </span>
          </div>
          <StatusBadge variant={typeVariant}>{typeLabel}</StatusBadge>
        </div>
        <ChevronDown
          size={14}
          className={`text-text-tertiary shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
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
            <div className="px-4 pb-4 pt-0 border-t border-border-subtle space-y-3 ml-12">
              {action.creation_context && (
                <Section title="Rationale">
                  {action.creation_context.rationale}
                </Section>
              )}
              <Section title="Verification Criteria">
                AI will verify this task is complete by analyzing photos submitted at job checkout.
                Evidence will be matched against this task description.
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-1">{title}</p>
      <p className="font-sans text-[14px] text-text-secondary leading-relaxed">{children}</p>
    </div>
  );
}
