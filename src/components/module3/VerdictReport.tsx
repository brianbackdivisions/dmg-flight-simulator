import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { TaskVerificationRow } from './TaskVerificationRow';
import { LaborPanel } from './LaborPanel';
import { WorkCompletionStatus, ConfidenceLevel } from '@/data/types';

function ConfidenceDots({ level }: { level: ConfidenceLevel }) {
  const count =
    level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH
      ? 3
      : level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM
      ? 2
      : 1;
  const color =
    level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH
      ? 'text-status-pass'
      : level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM
      ? 'text-status-warn'
      : 'text-status-fail';
  const label =
    level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH
      ? 'HIGH'
      : level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM
      ? 'MEDIUM'
      : 'LOW';
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`font-mono text-[16px] ${i < count ? color : 'text-text-tertiary'}`}>
          ●
        </span>
      ))}
      <span className={`font-mono text-[13px] ml-1 uppercase ${color}`}>{label}</span>
    </div>
  );
}

export function VerdictReport() {
  const { state, dispatch } = useStore();
  const { m3Response } = state;

  if (!m3Response) return null;

  const { verification_results, work_actions } = m3Response;
  const {
    work_completion_status: status,
    work_completion_confidence: confidence,
    work_verification_rationale: rationale,
    labor_hours_assessment,
  } = verification_results;

  const isComplete = status === WorkCompletionStatus.WORK_COMPLETION_STATUS_COMPLETE;
  const isIncomplete = status === WorkCompletionStatus.WORK_COMPLETION_STATUS_INCOMPLETE;
  const isHighConf = confidence === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH;
  const zeroTouch = isComplete && isHighConf;

  const verdictIcon = isComplete ? '✅' : isIncomplete ? '❌' : '⚠';
  const verdictLabel = isComplete
    ? 'WORK VERIFIED — COMPLETE'
    : isIncomplete
    ? 'WORK INCOMPLETE'
    : 'INDETERMINISTIC — Human Review Assigned';

  const verdictColor = isComplete
    ? 'border-status-pass text-status-pass bg-[rgba(16,185,129,0.08)]'
    : isIncomplete
    ? 'border-status-fail text-status-fail bg-[rgba(239,68,68,0.08)]'
    : 'border-status-warn text-status-warn bg-[rgba(245,158,11,0.08)]';

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
      {/* Verdict banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className={`rounded-[6px] border-2 ${verdictColor} p-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">{verdictIcon}</span>
            <span className="font-mono text-[18px] font-500 uppercase tracking-wider">
              {verdictLabel}
            </span>
          </div>
          <ConfidenceDots level={confidence} />
        </div>

        <div className="mt-3 pt-3 border-t border-current/20">
          {zeroTouch ? (
            <p className="font-mono text-[13px] text-status-pass">
              → ZERO-TOUCH APPROVED — Invoice proceeds automatically
            </p>
          ) : isComplete ? (
            <p className="font-mono text-[13px] text-status-warn">
              → Routed to OC for review (COMPLETE + MEDIUM confidence)
            </p>
          ) : (
            <p className="font-mono text-[13px] text-status-fail">
              → Routed to OC — manual review required
            </p>
          )}
        </div>
      </motion.div>

      {/* AI rationale */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <p className="font-mono text-[10px] text-accent-ai uppercase tracking-widest mb-2">
          AI WORK VERIFICATION SUMMARY
        </p>
        <div className="w-full h-px bg-border-subtle mb-4" />
        <p className="font-sans text-[15px] text-text-primary leading-[1.7]">{rationale}</p>
      </motion.div>

      {/* Task verification checklist */}
      <div>
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-3">
          Task Verification Checklist
        </p>
        <div className="space-y-2">
          {work_actions.map((action, i) => (
            <TaskVerificationRow
              key={action.action_id}
              action={action}
              index={i}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Labor panel */}
      <LaborPanel assessment={labor_hours_assessment} />

      {/* Input quality */}
      <InputQualityPanel />

      {/* CTA to summary */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => dispatch({ type: 'SET_STAGE', payload: 'summary' })}
        className="w-full py-3 rounded-[6px] bg-accent-action text-white font-sans text-[16px] font-500
                   hover:bg-[#d4561e] transition-colors"
      >
        View Demo Summary →
      </motion.button>
    </div>
  );
}

function InputQualityPanel() {
  const items = [
    { label: 'Photos', status: 'SUFFICIENT', note: '9 photos, good before/after coverage, no blur detected', color: 'text-status-pass' },
    { label: 'Scope', status: 'SUFFICIENT', note: 'Specific, actionable tasks with verification criteria', color: 'text-status-pass' },
    { label: 'Technician Notes', status: 'SPARSE', note: 'Brief checkout notes only — not used in assessment', color: 'text-status-warn' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="card p-5"
    >
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-3">
        Input Data Quality Assessment
      </p>
      <div className="w-full h-px bg-border-subtle mb-3" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-4">
            <span className="font-sans text-[13px] text-text-secondary w-32 shrink-0">{item.label}</span>
            <span className={`font-mono text-[12px] w-24 shrink-0 ${item.color}`}>{item.status}</span>
            <span className="font-sans text-[13px] text-text-tertiary">{item.note}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
