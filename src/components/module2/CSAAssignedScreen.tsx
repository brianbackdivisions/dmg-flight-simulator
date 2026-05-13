import { motion } from 'framer-motion';
import { Check, MapPin, Star, FileText, Calendar, Zap } from 'lucide-react';
import { useStore } from '@/state/store';
import { BEHAVIOR_LABEL_MAP, ConfidenceLevel } from '@/data/types';
import { AIEngineIcon } from '@/components/shared/AIEngineIcon';

function ConfidenceDots({ level }: { level: typeof ConfidenceLevel[keyof typeof ConfidenceLevel] }) {
  const count = level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 3 : level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 2 : 1;
  const color = level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 'text-status-pass' : level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 'text-status-warn' : 'text-status-fail';
  const label = level === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 'HIGH' : level === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 'MEDIUM' : 'LOW';
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`font-mono text-[12px] ${i < count ? color : 'text-text-tertiary'}`}>●</span>
      ))}
      <span className={`font-mono text-[11px] ml-1 ${color}`}>{label}</span>
    </div>
  );
}

function BehaviorLabel({ tag }: { tag: string }) {
  const label = BEHAVIOR_LABEL_MAP[tag] ?? tag.toUpperCase();
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] border font-mono text-[10px] uppercase tracking-wide bg-bg-surface2 border-accent-ai text-accent-ai">
      {label}
    </span>
  );
}

export function CSAAssignedScreen() {
  const { state, dispatch } = useStore();
  const { m2Response, assignedProvider, m1Response, m1Input } = state;

  const provider = assignedProvider ?? m2Response?.providers[0] ?? null;

  function handleSimulateJobCompletion() {
    dispatch({ type: 'SET_STAGE', payload: 'module3' });
    dispatch({ type: 'SET_M3_SCREEN', payload: 'photos' });
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
      {/* Header banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-l-2 border-l-status-pass p-5"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.12)] border border-status-pass flex items-center justify-center shrink-0">
            <Check size={22} className="text-status-pass" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-status-pass uppercase tracking-widest">CSA Auto-Assignment</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-[3px] border border-status-pass bg-[rgba(16,185,129,0.08)] text-status-pass uppercase tracking-wide">
                No Marketplace Needed
              </span>
            </div>
            <h2 className="font-sans text-[20px] font-600 text-text-primary leading-tight mb-2">
              CSA Provider Auto-Assigned
            </h2>
            <p className="font-sans text-[14px] text-text-secondary leading-relaxed">
              This is a contracted recurring service. A pre-qualified provider is already assigned to this property under an active CSA (Customer Schedule Activity) agreement. No marketplace matching required.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Job context */}
      {m1Response && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="card p-4 border-l-2 border-l-accent-ai"
        >
          <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-2">Job Brief</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-text-secondary uppercase">{m1Response.service_line_id.replace(/-/g, ' ')}</span>
            <span className="text-text-tertiary">·</span>
            <span className="font-mono text-[11px] text-text-secondary">{m1Response.work_type}</span>
            {m1Response.asset && (
              <>
                <span className="text-text-tertiary">·</span>
                <span className="font-mono text-[11px] text-text-secondary">{m1Response.asset}</span>
              </>
            )}
            <span className="text-text-tertiary">·</span>
            <MapPin size={10} className="text-text-tertiary" />
            <span className="font-mono text-[11px] text-text-tertiary">{m1Input.property}</span>
          </div>
        </motion.div>
      )}

      {/* CSA contract details */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-2 gap-3"
      >
        {[
          { icon: FileText, label: 'Agreement', value: 'Active CSA Agreement', color: 'text-status-pass' },
          { icon: Zap, label: 'Billing', value: 'Contracted Rate Applied', color: 'text-accent-ai' },
          { icon: Calendar, label: 'Service Type', value: 'Scheduled Service', color: 'text-text-secondary' },
          { icon: Check, label: 'Dispatch', value: 'Auto-dispatched per contract terms', color: 'text-text-secondary' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="card p-3 flex items-center gap-3"
            >
              <Icon size={13} className={`shrink-0 ${item.color}`} />
              <div className="min-w-0">
                <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-wider">{item.label}</p>
                <p className={`font-mono text-[11px] ${item.color} leading-tight mt-0.5`}>{item.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Assigned provider card */}
      {provider && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5 glow-ai"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[32px] font-500 text-text-tertiary leading-none">#1</span>
              <div>
                <h3 className="font-sans text-[18px] font-600 text-text-primary leading-tight">
                  {provider.provider_name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-status-pass uppercase tracking-wider">CSA Assigned Provider</span>
                  <span className="font-mono text-[10px] text-text-tertiary">·</span>
                  <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">AI Recommended</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {provider.confidence !== undefined && <ConfidenceDots level={provider.confidence} />}
              <div className="flex flex-col items-end">
                <span className="font-mono text-[28px] font-bold text-accent-ai leading-none">{provider.score}</span>
                <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-wider">Match Score</span>
              </div>
            </div>
          </div>

          {/* Behavior labels */}
          {provider.behavior_labels && provider.behavior_labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {provider.behavior_labels.map((tag) => (
                <BehaviorLabel key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-6 px-3 py-2 rounded-[4px] bg-bg-surface2 border border-border-subtle mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-text-tertiary shrink-0" />
              <span className="font-mono text-[11px] text-text-primary">
                {provider.provider_property_distance_in_miles} mi
              </span>
              <span className="font-mono text-[10px] text-text-tertiary">from HQ</span>
            </div>
            {provider.rating && (
              <>
                <div className="w-px h-3 bg-border-subtle" />
                <div className="flex items-center gap-1.5">
                  <Star size={11} className="text-text-tertiary shrink-0" />
                  <span className="font-mono text-[11px] text-text-primary">{provider.rating.toFixed(1)}</span>
                  <span className="font-mono text-[10px] text-text-tertiary">({provider.review_count?.toLocaleString()} reviews)</span>
                </div>
              </>
            )}
            {provider.jobs_completed && (
              <>
                <div className="w-px h-3 bg-border-subtle" />
                <span className="font-mono text-[11px] text-text-secondary">{provider.jobs_completed.toLocaleString()} jobs</span>
              </>
            )}
          </div>

          {/* Score dimensions */}
          {(provider.speed_score !== undefined || provider.quality_score !== undefined || provider.cost_score !== undefined) && (
            <div className="flex flex-col gap-2">
              {provider.speed_score !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-text-tertiary w-14 shrink-0">Speed</span>
                  <span className="font-mono text-[13px] text-text-primary w-8 shrink-0">{provider.speed_score}</span>
                  <div className="w-32 h-1.5 rounded-full bg-bg-surface2">
                    <div className="h-full rounded-full bg-accent-ai" style={{ width: `${provider.speed_score}%` }} />
                  </div>
                </div>
              )}
              {provider.quality_score !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-text-tertiary w-14 shrink-0">Quality</span>
                  <span className="font-mono text-[13px] text-text-primary w-8 shrink-0">{provider.quality_score}</span>
                  <div className="w-32 h-1.5 rounded-full bg-bg-surface2">
                    <div className="h-full rounded-full bg-accent-ai" style={{ width: `${provider.quality_score}%` }} />
                  </div>
                </div>
              )}
              {provider.cost_score !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-text-tertiary w-14 shrink-0">Cost</span>
                  <span className="font-mono text-[13px] text-text-primary w-8 shrink-0">{provider.cost_score}</span>
                  <div className="w-32 h-1.5 rounded-full bg-bg-surface2">
                    <div className="h-full rounded-full bg-accent-ai" style={{ width: `${provider.cost_score}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI rationale if present */}
          {provider.ai_rationale && (
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <p className="font-sans text-[13px] text-text-secondary italic leading-[1.6]">
                "{provider.ai_rationale}"
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleSimulateJobCompletion}
        className="w-full py-3 rounded-[6px] bg-accent-action text-white font-mono text-[13px] font-bold
                   tracking-[0.1em] uppercase hover:bg-[#d4561e] transition-colors flex items-center justify-center gap-2"
      >
        <AIEngineIcon size={14} />
        Simulate Job Completion →
      </motion.button>
    </div>
  );
}
