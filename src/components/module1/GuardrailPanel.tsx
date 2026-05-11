import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface AccuracyBarProps {
  label: string;
  value: number;
  threshold: number;
}

function AccuracyBar({ label, value, threshold }: AccuracyBarProps) {
  const pass = value >= threshold;
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[12px] text-text-tertiary w-24 shrink-0">{label}</span>
      <span className="font-mono text-[14px] text-text-primary w-10 shrink-0">{value}%</span>
      <div className="flex-1 h-1.5 rounded-full bg-bg-surface2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: pass ? '#10B981' : '#F59E0B' }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-[11px] text-text-tertiary w-16 shrink-0">
        {'> '}
        {threshold}%
      </span>
      {pass ? (
        <Check size={12} className="text-status-pass shrink-0" />
      ) : (
        <span className="font-mono text-[11px] text-status-warn">✗</span>
      )}
    </div>
  );
}

interface PolicyCheckProps {
  label: string;
  value: string;
}

function PolicyCheck({ label, value }: PolicyCheckProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="font-sans text-[13px] text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[12px] text-text-primary">{value}</span>
        <Check size={12} className="text-status-pass" />
      </div>
    </div>
  );
}

export function GuardrailPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className="card border-l-2 border-l-accent-ai">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
            AUTO-QUALIFICATION STATUS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] font-500 text-status-pass uppercase tracking-wider">
            ✅ APPROVED
          </span>
          <ChevronDown
            size={14}
            className={`text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
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
            <div className="px-5 pb-5 border-t border-border-subtle space-y-3 pt-4">
              <AccuracyBar label="L15 Accuracy" value={91} threshold={85} />
              <AccuracyBar label="L30 Accuracy" value={88} threshold={85} />

              <div className="border-t border-border-subtle pt-3 space-y-0">
                <PolicyCheck label="Customer policy" value="Not blocked" />
                <PolicyCheck label="Service line" value="In approved set" />
                <PolicyCheck label="Source type" value="Eligible" />
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <p className="font-sans text-[13px] text-text-secondary">
                  → This ticket qualifies for automatic dispatch. No manual review required.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
