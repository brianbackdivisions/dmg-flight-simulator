import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '@/state/store';
import type { AppStage } from '@/data/types';

const STAGES: { id: AppStage; label: string; num: number }[] = [
  { id: 'module1', label: 'Qualification & Enrichment', num: 1 },
  { id: 'module2', label: 'Marketplace Matching', num: 2 },
  { id: 'module3', label: 'Quality Verification', num: 3 },
];

const stageOrder: AppStage[] = ['scenario', 'module1', 'module2', 'module3', 'summary'];

function stageIndex(s: AppStage) {
  return stageOrder.indexOf(s);
}

export function StageRail() {
  const { state, dispatch } = useStore();
  const currentIdx = stageIndex(state.stage);

  return (
    <div className="flex items-center gap-1">
      {STAGES.map((stage, i) => {
        const stageIdx = stageIndex(stage.id);
        const isComplete = currentIdx > stageIdx;
        const isActive = state.stage === stage.id;
        const isLocked = currentIdx < stageIdx;

        return (
          <div key={stage.id} className="flex items-center">
            {i > 0 && (
              <svg className="mx-1 text-text-tertiary" width="12" height="12" viewBox="0 0 12 12">
                <path d="M3 2l6 4-6 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <motion.button
              onClick={() => {
                if (isComplete) {
                  dispatch({ type: 'SET_STAGE', payload: stage.id });
                }
              }}
              disabled={isLocked}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] transition-all duration-300 font-sans text-[13px] font-medium ${
                isActive
                  ? 'glow-ai text-accent-ai'
                  : isComplete
                  ? 'bg-[rgba(0,196,232,0.08)] text-accent-ai cursor-pointer hover:bg-[rgba(0,196,232,0.14)]'
                  : 'bg-bg-surface1 text-text-tertiary cursor-not-allowed opacity-50'
              }`}
            >
              {isComplete ? (
                <Check size={12} className="text-accent-ai" />
              ) : (
                <span className="font-mono text-[11px]">{stage.num}</span>
              )}
              <span>{stage.label}</span>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
