import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ScoreRing } from '@/components/shared/ScoreRing';
import type { ProviderScore } from '@/data/types';

interface Props {
  provider: ProviderScore | null;
  onClose: () => void;
}

function SubMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
      <span className="font-mono text-[12px] text-text-tertiary">{label}</span>
      <span className="font-mono text-[13px] text-text-primary">{value}</span>
    </div>
  );
}

export function ProviderScoreDrawer({ provider, onClose }: Props) {
  return (
    <AnimatePresence>
      {provider && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] bg-bg-surface1 border-l border-border-subtle z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border-subtle">
              <div>
                <h2 className="font-sans text-[17px] font-600 text-text-primary">{provider.provider_name}</h2>
                <p className="font-mono text-[11px] text-text-tertiary mt-0.5">Provider Score Detail</p>
              </div>
              <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Composite score ring */}
              <div className="flex flex-col items-center">
                <ScoreRing score={provider.score} size={120} label="Overall Match" />
              </div>

              {/* Sub-rings */}
              {provider.scorecard_details && (
                <div className="flex justify-center gap-6">
                  <ScoreRing
                    score={provider.scorecard_details.speed.overall}
                    size={80}
                    strokeWidth={6}
                    label="Speed"
                    color="#00C4E8"
                  />
                  <ScoreRing
                    score={provider.scorecard_details.quality.overall}
                    size={80}
                    strokeWidth={6}
                    label="Quality"
                    color="#10B981"
                  />
                  <ScoreRing
                    score={provider.scorecard_details.cost.overall}
                    size={80}
                    strokeWidth={6}
                    label="Cost"
                    color="#F59E0B"
                  />
                </div>
              )}

              {/* Sub-metrics grid */}
              {provider.scorecard_details && (
                <div className="grid grid-cols-3 gap-4">
                  <MetricGroup title="SPEED">
                    <SubMetric label="On-time arrival" value={provider.scorecard_details.speed.on_time_arrival} />
                    <SubMetric label="Time to work done" value={provider.scorecard_details.speed.time_to_work_done} />
                  </MetricGroup>
                  <MetricGroup title="QUALITY">
                    <SubMetric label="First-time complete" value={provider.scorecard_details.quality.first_time_complete} />
                    <SubMetric label="Defect-free jobs" value={provider.scorecard_details.quality.defect_free_jobs} />
                    <SubMetric label="App compliance" value={provider.scorecard_details.quality.app_compliance} />
                  </MetricGroup>
                  <MetricGroup title="COST">
                    <SubMetric label="Used {'<'}100% NTE" value={provider.scorecard_details.cost.used_under_nte} />
                    <SubMetric label="Dispute-free" value={provider.scorecard_details.cost.dispute_free} />
                  </MetricGroup>
                </div>
              )}

              {/* Stats row */}
              <div className="card p-4 flex items-center justify-between">
                <Stat label="Distance" value={`${provider.provider_property_distance_in_miles} mi`} />
                <div className="w-px h-8 bg-border-subtle" />
                <Stat label="Rating" value={`★ ${provider.rating?.toFixed(1) ?? '—'}`} />
                <div className="w-px h-8 bg-border-subtle" />
                <Stat label="Jobs" value={`${(provider.jobs_completed ?? 0).toLocaleString()}`} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetricGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[13px] text-text-primary">{value}</p>
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wide">{label}</p>
    </div>
  );
}
