import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ScanLine } from '@/components/shared/ScanLine';

const TIERS = [
  { label: 'Priority & Preferred Providers', count: 12 },
  { label: 'Top Model-Matched Providers', count: 18 },
  { label: 'Property Veterans', count: 4 },
  { label: 'High-Capacity Available', count: 9 },
  { label: 'Remaining Matched Providers', count: 8 },
];

const LOG_LINES = [
  'Running 23-stage eligibility filter pipeline...',
  'Tier 1: Priority & Preferred providers checked...',
  'Tier 2: Top model-matched providers (XGBoost) scored...',
  'Tier 3: Property veterans identified (3+ prior jobs at property)...',
  'Tier 4: High-capacity available providers checked...',
  'Tier 5: Remaining matched providers qualified...',
  '40 providers qualified. Launching AI recommendation analysis...',
  'Generating provider rationale and confidence scores...',
  'Ranking complete.',
];

// Dummy provider pins for the map area
const PINS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 20 + Math.random() * 60,
  y: 15 + Math.random() * 70,
  delay: i * 0.15,
}));

export function MarketplaceProcessing() {
  const [activeTiers, setActiveTiers] = useState<number[]>([]);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [animPins, setAnimPins] = useState<number[]>([]);

  useEffect(() => {
    TIERS.forEach((_, i) => {
      setTimeout(() => setActiveTiers((prev) => [...prev, i]), 800 + i * 700);
    });

    LOG_LINES.forEach((_, i) => {
      setTimeout(() => setLogLines((prev) => [...prev, LOG_LINES[i]]), 500 + i * 500);
    });

    PINS.forEach((pin) => {
      setTimeout(() => setAnimPins((prev) => [...prev, pin.id]), 300 + pin.delay * 1000);
    });
  }, []);

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-120px)] overflow-hidden">
      <ScanLine />

      {/* Map area */}
      <div className="relative flex-1 min-h-[280px] bg-[#0a1420] border-b border-border-subtle overflow-hidden">
        {/* Grid overlay for dark map feel */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#1A2D45 1px, transparent 1px), linear-gradient(90deg, #1A2D45 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle map-like radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,196,232,0.04),transparent_70%)]" />

        {/* Location label */}
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
          <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">
            Bloomington, IL · Provider Coverage Area
          </span>
        </div>

        {/* Provider pins */}
        {PINS.map((pin) =>
          animPins.includes(pin.id) ? (
            <motion.div
              key={pin.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-accent-ai" />
                <div className="absolute inset-0 rounded-full bg-accent-ai animate-ping opacity-40 scale-150" />
              </div>
            </motion.div>
          ) : null,
        )}

        {/* SCANNING label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-widest animate-pulse">
            SCANNING PROVIDER NETWORK...
          </span>
        </div>
      </div>

      {/* Tier pipeline */}
      <div className="px-8 py-6 space-y-3">
        {TIERS.map((tier, i) => {
          const done = activeTiers.includes(i);
          return (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="font-mono text-[12px] text-text-tertiary w-10 shrink-0">Tier {i + 1}</span>
              <span
                className={`font-mono text-[13px] flex-1 transition-colors ${
                  done ? 'text-text-primary' : 'text-text-tertiary'
                }`}
              >
                {tier.label}
              </span>
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="font-mono text-[12px] text-accent-ai">
                      [{tier.count} checked]
                    </span>
                    <Check size={12} className="text-status-pass" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <div className="border-t border-border-subtle pt-3 flex items-center justify-between">
          <span className="font-mono text-[12px] text-text-tertiary">40 qualified providers identified</span>
          {activeTiers.length >= TIERS.length && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[12px] text-accent-ai animate-pulse"
            >
              Generating AI recommendations...
            </motion.span>
          )}
        </div>

        {/* Streaming log */}
        <div className="card p-3 font-mono text-[12px] space-y-1 max-h-32 overflow-y-auto">
          {logLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-secondary"
            >
              <span className="text-text-tertiary mr-1">&gt;</span> {line}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
