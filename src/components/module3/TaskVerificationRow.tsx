import { motion } from 'framer-motion';
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

export function TaskVerificationRow({ action, index, delay = 0 }: Props) {
  const typeVariant =
    action.type === WorkActionType.WORK_ACTION_TYPE_ESSENTIAL ? 'warn' : action.type === WorkActionType.WORK_ACTION_TYPE_AUXILIARY ? 'ai' : 'slate';

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="card p-4 flex items-start gap-4"
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
        {action.status_update_context && (
          <p className="font-sans text-[13px] text-text-tertiary leading-relaxed">
            {action.status_update_context.rationale}
          </p>
        )}
      </div>
    </motion.div>
  );
}
