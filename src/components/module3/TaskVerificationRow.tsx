import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Image, Eye, FileText, BarChart2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { WorkAction } from '@/data/types';
import {
  WorkActionStatus,
  WorkActionType,
  WORK_ACTION_STATUS_LABELS,
  WORK_ACTION_TYPE_LABELS,
} from '@/data/types';

interface Props {
  action: WorkAction;
  index: number;
  delay?: number;
}

// Mock AI analysis per task index
const AI_ANALYSIS = [
  {
    imageRelevancyScore: 94,
    clarityAssessment: 'Clear, focused images. Pilot assembly is clearly visible in both before and after frames. Adequate lighting throughout.',
    photosUsed: ['Before Photo 1 — 08:14:22', 'After Photo 1 — 10:12:09'],
    confidenceReasoning: 'High-contrast before/after clearly shows sooty buildup removed. Model confidence: 0.94.',
  },
  {
    imageRelevancyScore: 91,
    clarityAssessment: 'Thermocouple and orifice clearly distinguishable. During photo provides strong mid-state evidence.',
    photosUsed: ['Before Photo 2 — 08:15:41', 'During Photo 1 — 09:02:17', 'After Photo 3 — 10:15:01'],
    confidenceReasoning: 'Three-photo sequence provides temporal proof of cleaning. Residue absent in final frame.',
  },
  {
    imageRelevancyScore: 97,
    clarityAssessment: 'Pilot flame clearly visible in after photo. No ambiguity in ignition state. Strong image quality.',
    photosUsed: ['After Photo 2 — 10:14:33', 'After Photo 3 — 10:15:01'],
    confidenceReasoning: 'Stable flame visible in two independent after-photos. Highest confidence of all tasks.',
  },
  {
    imageRelevancyScore: 88,
    clarityAssessment: 'Temperature gauge legible but partially occluded. Fixture test implied by context. Clarity: adequate.',
    photosUsed: ['After Photo 1 — 10:12:09'],
    confidenceReasoning: 'Single image provides sufficient evidence. Gauge reading visible. Minor occlusion noted but non-disqualifying.',
  },
];

function statusVariant(status: WorkActionStatus): 'pass' | 'warn' | 'fail' | 'ai' | 'slate' {
  switch (status) {
    case WorkActionStatus.WORK_ACTION_STATUS_COMPLETE: return 'pass';
    case WorkActionStatus.WORK_ACTION_STATUS_IN_PROGRESS: return 'ai';
    case WorkActionStatus.WORK_ACTION_STATUS_INCOMPLETE: return 'fail';
    case WorkActionStatus.WORK_ACTION_STATUS_INCONCLUSIVE: return 'warn';
    case WorkActionStatus.WORK_ACTION_STATUS_IRRELEVANT: return 'slate';
    default: return 'slate';
  }
}

function statusIcon(status: WorkActionStatus): string {
  switch (status) {
    case WorkActionStatus.WORK_ACTION_STATUS_COMPLETE: return '✅';
    case WorkActionStatus.WORK_ACTION_STATUS_IN_PROGRESS: return '🔄';
    case WorkActionStatus.WORK_ACTION_STATUS_INCOMPLETE: return '❌';
    case WorkActionStatus.WORK_ACTION_STATUS_INCONCLUSIVE: return '—';
    case WorkActionStatus.WORK_ACTION_STATUS_IRRELEVANT: return '⊘';
    default: return '·';
  }
}

function ScoreBar({ value }: { value: number }) {
  const color = value >= 90 ? '#10B981' : value >= 75 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-bg-surface2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-[12px] text-text-primary w-8 shrink-0">{value}%</span>
    </div>
  );
}

export function TaskVerificationRow({ action, index, delay = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const typeVariant =
    action.type === WorkActionType.WORK_ACTION_TYPE_ESSENTIAL
      ? 'warn'
      : action.type === WorkActionType.WORK_ACTION_TYPE_AUXILIARY
      ? 'ai'
      : 'slate';

  const aiData = AI_ANALYSIS[index] ?? AI_ANALYSIS[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="card overflow-hidden"
    >
      {/* ── Main row (clickable) ─────────────────────────────────────── */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-bg-surface2 transition-colors"
      >
        {/* Task num */}
        <span className="font-mono text-[20px] text-text-tertiary leading-none shrink-0 w-7 text-right mt-0.5">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Title + badges */}
          <div className="flex items-start gap-2 flex-wrap">
            <span className="font-sans text-[14px] font-500 text-text-primary flex-1">
              {action.description}
            </span>
            <StatusBadge variant={typeVariant}>{WORK_ACTION_TYPE_LABELS[action.type]}</StatusBadge>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-2">
            <span className="text-[14px]">{statusIcon(action.status)}</span>
            <StatusBadge variant={statusVariant(action.status)}>
              {WORK_ACTION_STATUS_LABELS[action.status]}
            </StatusBadge>
          </div>

          {/* Evidence note */}
          {action.status_update_context && !expanded && (
            <p className="font-sans text-[13px] text-text-tertiary leading-relaxed line-clamp-1">
              {action.status_update_context.rationale}
            </p>
          )}
        </div>

        {/* Expand chevron */}
        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
            {expanded ? 'Hide' : 'AI Analysis'}
          </span>
          <ChevronDown
            size={12}
            className={`text-text-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* ── Detail panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border-subtle"
          >
            <div className="p-4 bg-bg-surface2 space-y-4">
              {/* Evidence rationale */}
              {action.status_update_context && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FileText size={11} className="text-accent-ai" />
                    <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">Evidence Rationale</span>
                  </div>
                  <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                    {action.status_update_context.rationale}
                  </p>
                </div>
              )}

              {/* Image relevancy score */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart2 size={11} className="text-accent-ai" />
                  <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">Image Relevancy Score</span>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreBar value={aiData.imageRelevancyScore} />
                </div>
              </div>

              {/* Clarity assessment */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Eye size={11} className="text-accent-ai" />
                  <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">Clarity Assessment</span>
                </div>
                <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                  {aiData.clarityAssessment}
                </p>
              </div>

              {/* Photos used */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Image size={11} className="text-accent-ai" />
                  <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">
                    Photos Used ({aiData.photosUsed.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiData.photosUsed.map((photo) => (
                    <span
                      key={photo}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-[3px] border border-border-subtle text-text-secondary bg-bg-surface1"
                    >
                      {photo}
                    </span>
                  ))}
                </div>
              </div>

              {/* Confidence reasoning */}
              <div className="border-t border-border-subtle pt-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                    Confidence Reasoning
                  </span>
                </div>
                <p className="font-sans text-[12px] text-text-tertiary leading-relaxed italic">
                  {aiData.confidenceReasoning}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
