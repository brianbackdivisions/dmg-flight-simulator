import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, FileText, List, Check } from 'lucide-react';
import { useStore } from '@/state/store';
import { AIEngineIcon } from '@/components/shared/AIEngineIcon';
import { TaskVerificationRow } from './TaskVerificationRow';
import { WorkCompletionStatus, ConfidenceLevel } from '@/data/types';

// ─── Input signal cards ───────────────────────────────────────────────────────

const INPUT_SIGNALS = [
  {
    icon: MapPin,
    label: 'GPS Check-In',
    sub: 'Location verified · Summit Plumbing',
    detail: 'Coordinates match job site within 12 meters',
  },
  {
    icon: Camera,
    label: 'Photos Submitted',
    sub: '9 photos · Before / During / After',
    detail: '3 before · 3 during · 3 after',
  },
  {
    icon: FileText,
    label: 'AI Enriched Scope',
    sub: '4 tasks · verification criteria loaded',
    detail: 'From Phase 1 qualification output',
  },
  {
    icon: List,
    label: 'Work Actions',
    sub: '4 essential tasks · priority HIGH',
    detail: 'All tasks loaded for evidence matching',
  },
];

// ─── Verdict forming items ────────────────────────────────────────────────────

const VERDICT_ITEMS = [
  { label: 'Work Completion', initial: 'Analyzing photo evidence...' },
  { label: 'Confidence Gate', initial: 'Running confidence model...' },
  { label: 'Labor Assessment', initial: 'Evaluating labor hours...' },
  { label: 'Zero-Touch Eligibility', initial: 'Checking approval criteria...' },
];

// ─── Log stream ───────────────────────────────────────────────────────────────

const LOG_LINES = [
  'Loading enriched scope and task criteria from Phase 1...',
  'Reviewing 9 photos across 3 visit windows...',
  'Analyzing before photos (3 images)...',
  'Analyzing during photos (3 images)...',
  'Analyzing after photos (3 images)...',
  'Evaluating ESSENTIAL task completion against criteria...',
  'Running labor appropriateness assessment...',
  'Confidence gate: COMPLETE + HIGH — qualifying...',
  'Verdict ready.',
];

// ─── Confidence dots ─────────────────────────────────────────────────────────

function ConfidenceDots({ level }: { level: typeof ConfidenceLevel[keyof typeof ConfidenceLevel] }) {
  const count =
    level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 3 :
    level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 2 : 1;
  const color =
    level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 'text-status-pass' :
    level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 'text-status-warn' : 'text-status-fail';
  const label =
    level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 'HIGH' :
    level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 'MED' : 'LOW';
  return (
    <div className={`flex items-center gap-0.5 ${color}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`font-mono text-[13px] ${i < count ? color : 'text-text-tertiary'}`}>●</span>
      ))}
      <span className={`font-mono text-[10px] ml-1 uppercase ${color}`}>{label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VerificationProcessing() {
  const { state, dispatch } = useStore();
  const [activeInputs, setActiveInputs]   = useState<number[]>([]);
  const [centerActive, setCenterActive]   = useState(false);
  const [activeVerdict, setActiveVerdict] = useState<number[]>([]);
  const [logLines, setLogLines]           = useState<string[]>([]);
  const [done, setDone]                   = useState(false);
  const startedRef = useRef(false);

  const { m3Response } = state;
  const hasResults = !!m3Response;

  const providerName = state.assignedProvider?.provider_name ?? 'Summit Plumbing';
  const taskCount    = state.m1WorkActions.length || 4;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    INPUT_SIGNALS.forEach((_, i) => {
      setTimeout(() => setActiveInputs(prev => [...prev, i]), 300 + i * 350);
    });

    setTimeout(() => setCenterActive(true), 1800);

    VERDICT_ITEMS.forEach((_, i) => {
      setTimeout(() => setActiveVerdict(prev => [...prev, i]), 2200 + i * 300);
    });

    LOG_LINES.forEach((_, i) => {
      setTimeout(() => setLogLines(prev => [...prev, LOG_LINES[i]]), 400 + i * 320);
    });

    setTimeout(() => setDone(true), 400 + LOG_LINES.length * 320 + 200);
  }, []);

  // Derived verdict data (only when results are available)
  const verdictData = hasResults ? (() => {
    const { verification_results, work_actions } = m3Response;
    const {
      work_completion_status: status,
      work_completion_confidence: confidence,
      work_verification_rationale: rationale,
    } = verification_results;
    const isComplete   = status === WorkCompletionStatus.WORK_COMPLETION_STATUS_COMPLETE;
    const isIncomplete = status === WorkCompletionStatus.WORK_COMPLETION_STATUS_INCOMPLETE;
    const isHighConf   = confidence === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH;
    const zeroTouch    = isComplete && isHighConf;
    const verdictLabel = isComplete
      ? 'WORK VERIFIED — COMPLETE'
      : isIncomplete
      ? 'WORK INCOMPLETE'
      : 'INDETERMINISTIC — Human Review';
    const verdictColor = isComplete
      ? 'border-status-pass text-status-pass bg-[rgba(16,185,129,0.08)]'
      : isIncomplete
      ? 'border-status-fail text-status-fail bg-[rgba(239,68,68,0.08)]'
      : 'border-status-warn text-status-warn bg-[rgba(245,158,11,0.08)]';
    const routingText = zeroTouch
      ? '→ ZERO-TOUCH APPROVED — Invoice proceeds automatically'
      : isComplete
      ? '→ Routed to OC for review (COMPLETE + MEDIUM confidence)'
      : '→ Routed to OC — manual review required';
    const routingColor = zeroTouch
      ? 'text-status-pass'
      : isComplete
      ? 'text-status-warn'
      : 'text-status-fail';
    return { status, confidence, rationale, isComplete, zeroTouch, verdictLabel, verdictColor, routingText, routingColor, work_actions };
  })() : null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-6 pb-4 border-b border-border-subtle">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-2 mb-1">
            <AIEngineIcon size={14} className={hasResults ? 'text-status-pass' : 'text-accent-ai'} />
            <span className={`font-mono text-[11px] uppercase tracking-widest transition-colors duration-500 ${
              hasResults ? 'text-status-pass' : 'text-accent-ai'
            }`}>
              AI Quality Verification
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {hasResults && verdictData ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} className="text-status-pass shrink-0" />
                  <span className="font-sans text-[15px] text-text-primary">
                    Verification complete · {verdictData.verdictLabel}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
                  <span className="font-sans text-[15px] text-text-secondary">
                    Running completion assessment for {providerName}...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Main 3-column flow ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-stretch overflow-hidden">

        {/* Left: Input signals */}
        <div className="w-[260px] shrink-0 border-r border-border-subtle p-5 space-y-3 overflow-y-auto">
          <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-4">
            Input Signals
          </p>
          {INPUT_SIGNALS.map((signal, i) => {
            const Icon   = signal.icon;
            const active = activeInputs.includes(i);
            const label  = i === 0
              ? signal.sub.replace('Summit Plumbing', providerName)
              : i === 2
              ? `${taskCount} tasks · verification criteria loaded`
              : signal.sub;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: active ? 1 : 0.2, x: 0 }}
                transition={{ duration: 0.35 }}
                className={`card p-3 flex items-start gap-2.5 transition-all duration-300 ${
                  active ? 'border-accent-ai bg-[rgba(0,196,232,0.04)]' : ''
                }`}
              >
                <Icon
                  size={13}
                  className={active ? 'text-accent-ai shrink-0 mt-0.5' : 'text-text-tertiary shrink-0 mt-0.5'}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-text-primary uppercase tracking-wide leading-tight">
                    {signal.label}
                  </p>
                  <p className="font-sans text-[11px] text-text-tertiary mt-0.5 leading-tight">{label}</p>
                </div>
                {active && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto shrink-0">
                    <Check size={11} className="text-status-pass" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Center: AI node + flow arrows */}
        <div className="w-[120px] shrink-0 flex flex-col items-center justify-center gap-4 relative">
          {/* Flow arrows left→center */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-around pointer-events-none">
            {INPUT_SIGNALS.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeInputs.includes(i) ? 0.5 : 0 }}
                className="font-mono text-[12px] text-accent-ai"
              >
                →
              </motion.div>
            ))}
          </div>

          {/* AI Engine node */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: centerActive ? 1 : 0.8, opacity: centerActive ? 1 : 0.3 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                  hasResults
                    ? 'border-status-pass shadow-[0_0_14px_rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)]'
                    : centerActive
                    ? 'border-accent-ai shadow-glow-ai bg-[rgba(0,196,232,0.1)]'
                    : 'border-border-subtle bg-bg-surface1'
                }`}
              >
                <AnimatePresence mode="wait">
                  {hasResults ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.4 }}>
                      <Check size={22} className="text-status-pass" />
                    </motion.div>
                  ) : (
                    <motion.div key="ai" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AIEngineIcon size={22} className={centerActive ? 'text-accent-ai' : 'text-text-tertiary'} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Pulse ring — only while processing */}
              {centerActive && !hasResults && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent-ai"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </div>
            <span className={`font-mono text-[9px] uppercase text-center tracking-wider leading-tight transition-colors duration-500 ${
              hasResults ? 'text-status-pass' : 'text-accent-ai'
            }`}>
              {hasResults ? 'Complete' : 'AI Engine'}
            </span>
          </motion.div>

          {/* Flow arrows center→right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col items-center justify-around pointer-events-none">
            {VERDICT_ITEMS.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeVerdict.includes(i) ? 0.5 : 0 }}
                className="font-mono text-[12px] text-accent-ai"
              >
                →
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Verdict forming → Results */}
        <div className="flex-1 border-l border-border-subtle p-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            {hasResults && verdictData ? (

              /* ── Results panel ────────────────────────────────────────── */
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-3"
              >
                <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-4">
                  Verification Results
                </p>

                {/* Verdict banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05, type: 'spring', duration: 0.45 }}
                  className={`rounded-[6px] border ${verdictData.verdictColor} p-3`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      {verdictData.verdictLabel}
                    </span>
                    <ConfidenceDots level={verdictData.confidence} />
                  </div>
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className={`font-mono text-[10px] ${verdictData.routingColor}`}>
                      {verdictData.routingText}
                    </p>
                  </div>
                </motion.div>

                {/* AI rationale */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="card p-3"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <AIEngineIcon size={11} className="text-accent-ai" />
                    <p className="font-mono text-[10px] text-accent-ai uppercase tracking-widest">
                      AI Rationale
                    </p>
                  </div>
                  <div className="w-full h-px bg-border-subtle mb-2" />
                  <p className="font-sans text-[12px] text-text-primary leading-relaxed">
                    {verdictData.rationale}
                  </p>
                </motion.div>

                {/* Task verification checklist */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-2">
                    Task Verification
                  </p>
                  <div className="space-y-1.5">
                    {verdictData.work_actions.map((action, i) => (
                      <TaskVerificationRow
                        key={action.action_id}
                        action={action}
                        index={i}
                        delay={i * 0.08}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  onClick={() => dispatch({ type: 'SET_STAGE', payload: 'summary' })}
                  className="w-full py-2.5 rounded-[6px] bg-accent-action text-white font-mono text-[12px]
                             font-bold tracking-[0.1em] uppercase hover:bg-[#d4561e] transition-colors
                             flex items-center justify-center gap-2 mt-2"
                >
                  <AIEngineIcon size={13} />
                  View Job Debrief →
                </motion.button>
              </motion.div>

            ) : (

              /* ── Verdict forming animation ─────────────────────────── */
              <motion.div
                key="forming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-3"
              >
                <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-4">
                  Verdict Forming
                </p>
                {VERDICT_ITEMS.map((item, i) => {
                  const active = activeVerdict.includes(i);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: active ? 1 : 0.2, x: 0 }}
                      transition={{ duration: 0.35 }}
                      className={`card p-3 transition-all duration-300 ${
                        active ? 'border-accent-ai bg-[rgba(0,196,232,0.04)]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wide">
                          {item.label}
                        </span>
                        {active && (
                          <motion.div
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="flex items-center gap-1"
                          >
                            <div className="w-1 h-1 rounded-full bg-accent-ai" />
                            <div className="w-1 h-1 rounded-full bg-accent-ai" />
                            <div className="w-1 h-1 rounded-full bg-accent-ai" />
                          </motion.div>
                        )}
                      </div>
                      <p className="font-sans text-[12px] text-text-tertiary mt-1 leading-tight">
                        {item.initial}
                      </p>
                    </motion.div>
                  );
                })}

                {done && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-3 border-status-pass bg-[rgba(16,185,129,0.08)]"
                  >
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-status-pass" />
                      <span className="font-mono text-[11px] text-status-pass uppercase tracking-wider">
                        Verdict Ready · Waiting for response...
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Log stream ─────────────────────────────────────────────────── */}
      <div className="border-t border-border-subtle px-8 py-4 max-h-40 overflow-y-auto bg-bg-base">
        <div className="font-mono text-[11px] space-y-1">
          <AnimatePresence>
            {logLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${i === logLines.length - 1 && done ? 'text-accent-ai' : 'text-text-secondary'}`}
              >
                <span className="text-text-tertiary mr-1">&gt;</span> {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
