import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BookOpen, Sparkles, Check } from 'lucide-react';
import { ScanLine } from '@/components/shared/ScanLine';
import { DataSourceNode } from '@/components/shared/DataSourceNode';

const IRIS_PHASES = [
  { label: 'Scope Extraction', duration: 800 },
  { label: 'Complexity Evaluation', duration: 900 },
  { label: 'Policy Retrieval', duration: 700 },
  { label: 'Special Instructions', duration: 600 },
];

const LOG_LINES = [
  'Initializing qualification pipeline for ticket...',
  'Phase 1: Scope Extraction — parsing work description and image context...',
  'Phase 2: Complexity Evaluation — scoring against 20,247,831 historical jobs...',
  'Retrieving customer policy configuration (Heartland Dental, 280 parameters)...',
  'Phase 3: Policy Retrieval — applying account-level constraints...',
  'Checking auto-qualification eligibility...',
  'Phase 4: Special Instructions — generating provider guidance...',
  'L15 accuracy: 91%  L30 accuracy: 88%  Threshold: 85%  ✓',
  'All qualification checks passed. Auto-dispatch approved.',
];

const COMPLETE_LINE = 'Complete. Generated in 2.4s.';

export function QualificationProcessing() {
  const [activePhase, setActivePhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState(-1);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Animate nodes
    const nodeTimers = [0, 600, 1200].map((delay, i) =>
      setTimeout(() => setActiveNode(i), 400 + delay),
    );

    // Animate phases
    let elapsed = 800;
    const phaseTimers = IRIS_PHASES.map((phase, i) => {
      const t = setTimeout(() => {
        setActivePhase(i);
        const ct = setTimeout(() => {
          setCompletedPhases((prev) => [...prev, i]);
          if (i === IRIS_PHASES.length - 1) setDone(true);
        }, phase.duration);
        return ct;
      }, elapsed);
      elapsed += phase.duration + 200;
      return t;
    });

    // Animate log lines
    LOG_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLogLines((prev) => [...prev, line]);
      }, 600 + i * 450);
    });

    return () => {
      nodeTimers.forEach(clearTimeout);
      phaseTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12 overflow-hidden">
      <ScanLine />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-10"
      >
        <span className="font-mono text-[11px] text-accent-ai uppercase tracking-widest">
          IRIS Qualification Pipeline
        </span>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
          <span className="font-sans text-[15px] text-text-secondary">Processing work order...</span>
        </div>
      </motion.div>

      {/* Data source nodes */}
      <div className="flex gap-6 mb-8">
        <DataSourceNode
          icon={Database}
          label="20M+ Historical Jobs"
          subtext="Matched to similar work orders"
          active={activeNode >= 0}
          delay={0}
        />
        <DataSourceNode
          icon={BookOpen}
          label="Customer Rulebook"
          subtext="280+ parameters for your account"
          active={activeNode >= 1}
          delay={0.1}
        />
        <DataSourceNode
          icon={Sparkles}
          label="Proprietary AI Models"
          subtext="Fine-tuned on facilities maintenance"
          active={activeNode >= 2}
          delay={0.2}
        />
      </div>

      {/* IRIS phases */}
      <div className="w-full max-w-[600px] flex flex-col gap-2 mb-8">
        {IRIS_PHASES.map((phase, i) => {
          const isComplete = completedPhases.includes(i);
          const isActive = activePhase === i && !isComplete;

          return (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-[12px] text-text-tertiary w-6 text-right">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`font-mono text-[12px] transition-colors ${
                      isComplete ? 'text-accent-ai' : isActive ? 'text-text-primary' : 'text-text-tertiary'
                    }`}
                  >
                    Phase {i + 1}: {phase.label}
                  </span>
                  {isComplete && <Check size={12} className="text-status-pass" />}
                  {isActive && (
                    <span className="font-mono text-[11px] text-text-tertiary animate-pulse">running...</span>
                  )}
                </div>
                <div className="h-1 rounded-full bg-bg-surface2 overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-ai rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isComplete ? '100%' : isActive ? '70%' : '0%' }}
                    transition={{ duration: isActive ? phase.duration / 1000 : 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Streaming log */}
      <div className="w-full max-w-[600px] card p-4 font-mono text-[13px] space-y-1.5 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {logLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text-secondary leading-relaxed"
            >
              <span className="text-text-tertiary mr-1">&gt;</span> {line}
            </motion.div>
          ))}
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-ai"
            >
              <span className="text-text-tertiary mr-1">&gt;</span> {COMPLETE_LINE}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
