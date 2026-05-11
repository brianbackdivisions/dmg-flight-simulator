import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, FileText } from 'lucide-react';
import { ScanLine } from '@/components/shared/ScanLine';

const LOG_LINES = [
  'Phase 3: Completion Assessment initiated...',
  'Loading enriched scope and task criteria from intake (Phase 1)...',
  'Reviewing 9 photos across 3 visit windows...',
  'Analyzing before photos (3 images)...',
  'Analyzing during photos (3 images)...',
  'Analyzing after photos (3 images)...',
  'Evaluating ESSENTIAL task completion against verification criteria...',
  'Running labor appropriateness assessment...',
  'Confidence gate: COMPLETE + HIGH — qualifying for zero-touch approval...',
];

const COMPLETE_LINE = 'Verdict ready.';

const INPUT_NODES = [
  {
    icon: MapPin,
    label: 'GPS CHECK-IN',
    sub: 'Location verified · Summit Plumbing',
  },
  {
    icon: Camera,
    label: 'PHOTOS',
    sub: '9 photos submitted · Before / During / After',
  },
  {
    icon: FileText,
    label: 'AI ENRICHED SCOPE',
    sub: '4 tasks · verification criteria loaded',
  },
];

export function VerificationProcessing() {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    [0, 1, 2].forEach((i) => {
      setTimeout(() => {
        setActiveNodes((prev) => [...prev, i]);
        if (i === 2) setPulse(true);
      }, 600 + i * 800);
    });

    LOG_LINES.forEach((line, i) => {
      setTimeout(() => setLogLines((prev) => [...prev, line]), 800 + i * 1800);
    });

    setTimeout(() => setDone(true), 800 + LOG_LINES.length * 1800 + 600);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12 overflow-hidden">
      <ScanLine />

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <span className="font-mono text-[11px] text-accent-ai uppercase tracking-widest">
          Hawk-Eye Work Verification
        </span>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
          <span className="font-sans text-[15px] text-text-secondary">
            Running completion assessment...
          </span>
        </div>
      </motion.div>

      {/* Triangle input nodes */}
      <div className="relative w-full max-w-[520px] h-[200px] mb-8">
        {/* Top-left node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: activeNodes.includes(0) ? 1 : 0.3, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute left-0 top-0"
        >
          <InputNode {...INPUT_NODES[0]} active={activeNodes.includes(0)} />
        </motion.div>

        {/* Top-right node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: activeNodes.includes(1) ? 1 : 0.3, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="absolute right-0 top-0"
        >
          <InputNode {...INPUT_NODES[1]} active={activeNodes.includes(1)} />
        </motion.div>

        {/* Bottom-center node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: activeNodes.includes(2) ? 1 : 0.3, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
        >
          <InputNode {...INPUT_NODES[2]} active={activeNodes.includes(2)} />
        </motion.div>

        {/* Central AI node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              pulse
                ? 'border-accent-ai shadow-glow-ai bg-[rgba(0,196,232,0.1)]'
                : 'border-border-subtle bg-bg-surface1'
            }`}
          >
            <span className="font-mono text-[9px] text-accent-ai uppercase text-center leading-tight px-1">
              AI WORK VERIFY
            </span>
          </div>
          {pulse && (
            <div className="absolute inset-0 rounded-full border-2 border-accent-ai animate-ping opacity-20" />
          )}
        </div>
      </div>

      {/* Log stream */}
      <div className="w-full max-w-[600px] card p-4 font-mono text-[12px] space-y-1.5 max-h-52 overflow-y-auto">
        <AnimatePresence>
          {logLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text-secondary"
            >
              <span className="text-text-tertiary mr-1">&gt;</span> {line}
            </motion.div>
          ))}
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-ai font-500"
            >
              <span className="text-text-tertiary mr-1">&gt;</span> {COMPLETE_LINE}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 font-mono text-[11px] text-text-tertiary text-center">
        Hawk-Eye Temporal workflow — typically completes in 15–45 seconds
      </p>
    </div>
  );
}

function InputNode({
  icon: Icon,
  label,
  sub,
  active,
}: {
  icon: typeof MapPin;
  label: string;
  sub: string;
  active: boolean;
}) {
  return (
    <div
      className={`card px-3 py-2 flex flex-col items-center text-center gap-1 min-w-[140px] transition-all duration-300 ${
        active ? 'glow-ai' : ''
      }`}
    >
      <Icon size={16} className={active ? 'text-accent-ai' : 'text-text-tertiary'} />
      <span className="font-mono text-[10px] text-text-primary uppercase tracking-wider">{label}</span>
      <span className="font-sans text-[11px] text-text-tertiary leading-tight">{sub}</span>
    </div>
  );
}
