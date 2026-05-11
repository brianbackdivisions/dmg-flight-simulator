import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { LaborHoursAssessment } from '@/data/types';
import { ConfidenceLevel } from '@/data/types';

interface Props {
  assessment: LaborHoursAssessment;
}

export function LaborPanel({ assessment }: Props) {
  const pass = assessment.is_appropriate;
  const confLabel =
    assessment.confidence === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH
      ? 'HIGH'
      : assessment.confidence === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM
      ? 'MEDIUM'
      : 'LOW';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
          Labor Review
        </span>
        <span className={`font-mono text-[12px] font-500 ${pass ? 'text-status-pass' : 'text-status-fail'}`}>
          {pass ? '✅ APPROVED FOR BILLING' : '❌ FLAGGED FOR REVIEW'}
        </span>
      </div>

      <div className="border-t border-border-subtle pt-3 space-y-2">
        <div className="flex items-center gap-4">
          <InfoCell label="Time on-site" value="47 minutes" />
          <InfoCell label="Expected range" value="30–75 min" />
          <div className="flex items-center gap-1.5">
            {pass ? <Check size={12} className="text-status-pass" /> : null}
            <span className={`font-mono text-[12px] ${pass ? 'text-status-pass' : 'text-status-fail'}`}>
              Within range
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <InfoCell label="Assessment" value={`is_appropriate=${assessment.is_appropriate ? 'true' : 'false'}`} />
          <InfoCell label="Confidence" value={confLabel} />
          {pass && <Check size={12} className="text-status-pass" />}
        </div>

        <div className="pt-2 border-t border-border-subtle">
          <p className="font-sans text-[13px] text-text-secondary">
            {pass
              ? '→ Invoice may proceed automatically. No human review required.'
              : '→ Routed to OC for manual review.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">{label}</p>
      <p className="font-mono text-[13px] text-text-primary">{value}</p>
    </div>
  );
}
