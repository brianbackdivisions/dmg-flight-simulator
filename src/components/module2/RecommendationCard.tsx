import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Navigation } from 'lucide-react';
import type { ProviderScore } from '@/data/types';
import { ConfidenceLevel, BEHAVIOR_LABEL_MAP } from '@/data/types';

interface Props {
  provider: ProviderScore;
  rank: number;
  delay?: number;
  onViewDetails: () => void;
}

function getEtaAndSignal(distanceMiles: number): { eta: string; signal: string; signalColor: string } {
  if (distanceMiles < 8) {
    return {
      eta: '< 30 min',
      signal: 'Available now',
      signalColor: 'text-status-pass',
    };
  } else if (distanceMiles < 13) {
    return {
      eta: '~45 min',
      signal: 'Currently servicing a nearby location',
      signalColor: 'text-status-warn',
    };
  } else {
    return {
      eta: '~1 hr',
      signal: 'En route from previous job',
      signalColor: 'text-text-tertiary',
    };
  }
}

function ConfidenceDots({ level }: { level: ConfidenceLevel }) {
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

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] text-text-tertiary w-14 shrink-0">{label}</span>
      <span className="font-mono text-[13px] text-text-primary w-8 shrink-0">{value}</span>
      <div className="w-20 h-1.5 rounded-full bg-bg-surface2">
        <div className="h-full rounded-full bg-accent-ai" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function BehaviorLabel({ tag }: { tag: string }) {
  const label = BEHAVIOR_LABEL_MAP[tag] ?? tag.toUpperCase();
  const isNegative = tag === 'chronic_ghoster';
  const isEngagement = tag === 'active_viewer' || tag === 'chronic_ghoster';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] border font-mono text-[10px] uppercase tracking-wide ${
        isNegative
          ? 'bg-[rgba(239,68,68,0.08)] border-status-fail text-status-fail'
          : isEngagement
          ? 'bg-[rgba(245,158,11,0.08)] border-status-warn text-status-warn'
          : 'bg-bg-surface2 border-accent-ai text-accent-ai'
      }`}
    >
      {isEngagement && <span className="text-[8px]">◉</span>}
      {label}
    </span>
  );
}

export function RecommendationCard({ provider, rank, delay = 0, onViewDetails }: Props) {
  const isTop = rank === 1;
  const { eta, signal, signalColor } = getEtaAndSignal(provider.provider_property_distance_in_miles);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card p-5 ${isTop ? 'glow-ai' : 'hover:bg-bg-surface2'} transition-all duration-200`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-sans text-[32px] font-500 text-text-tertiary leading-none">#{rank}</span>
          <div>
            <h3 className="font-sans text-[18px] font-600 text-text-primary leading-tight">
              {provider.provider_name}
            </h3>
            {provider.is_provider_recommended_for_job && (
              <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">AI Recommended</span>
            )}
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

      {/* ETA + Routing signal row */}
      <div className="flex items-center gap-4 mb-3 px-3 py-2 rounded-[4px] bg-bg-surface2 border border-border-subtle">
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-accent-ai shrink-0" />
          <span className="font-mono text-[11px] text-text-primary">
            ETA <span className="text-accent-ai font-bold">{eta}</span>
          </span>
        </div>
        <div className="w-px h-3 bg-border-subtle" />
        <div className="flex items-center gap-1.5">
          <Navigation size={11} className={`shrink-0 ${signalColor}`} />
          <span className={`font-mono text-[11px] ${signalColor}`}>{signal}</span>
        </div>
      </div>

      {/* AI rationale */}
      {provider.ai_rationale && (
        <div className="border-t border-border-subtle pt-3 mb-3">
          <p className="font-sans text-[14px] text-text-secondary italic leading-[1.6]">
            "{provider.ai_rationale}"
          </p>
        </div>
      )}

      {/* Behavior labels */}
      {provider.behavior_labels && provider.behavior_labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.behavior_labels.map((tag) => (
            <BehaviorLabel key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Score bars + stats */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          {provider.speed_score !== undefined && <ScoreBar label="Speed" value={provider.speed_score} />}
          {provider.quality_score !== undefined && <ScoreBar label="Quality" value={provider.quality_score} />}
          {provider.cost_score !== undefined && <ScoreBar label="Cost" value={provider.cost_score} />}
        </div>

        <div className="flex flex-col gap-1.5 text-right">
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-[12px] text-text-secondary flex items-center gap-1 justify-end">
              <MapPin size={10} />
              {provider.provider_property_distance_in_miles} mi
            </span>
            <span className="font-mono text-[9px] text-text-tertiary">from registered HQ</span>
          </div>
          {provider.rating && (
            <span className="font-mono text-[12px] text-text-secondary flex items-center gap-1 justify-end">
              <Star size={10} />
              {provider.rating.toFixed(1)} ({provider.review_count?.toLocaleString()} reviews)
            </span>
          )}
          {provider.jobs_completed && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-mono text-[12px] text-text-secondary">
                {provider.jobs_completed.toLocaleString()} jobs
              </span>
              <span className="font-mono text-[9px] text-text-tertiary">trailing 12 mo</span>
            </div>
          )}
        </div>
      </div>

      {/* View details */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex justify-end">
        <button onClick={onViewDetails} className="font-sans text-[13px] text-accent-ai hover:underline">
          View Details ›
        </button>
      </div>
    </motion.div>
  );
}
