import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wrench, Zap, Clock } from 'lucide-react';
import { useStore } from '@/state/store';
import { getScenario } from '@/data/scenarios';
import { RecommendationCard } from './RecommendationCard';
import { ProviderScoreDrawer } from './ProviderScoreDrawer';
import { FullProviderList } from './FullProviderList';
import { FiltrationPanel } from './FiltrationPanel';
import { AIEngineIcon } from '@/components/shared/AIEngineIcon';
import type { ProviderScore } from '@/data/types';

function JobBriefCard() {
  const { state } = useStore();
  const { m1Response, m1Input, m1WorkActions, selectedScenario } = state;
  const scenario = selectedScenario ? getScenario(selectedScenario) : null;
  const urgency = (scenario as { urgency?: string } | undefined)?.urgency ?? m1Input.urgency;

  const isEmergency = urgency === 'emergency';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border-l-2 border-l-accent-ai p-4"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Job details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-accent-ai uppercase tracking-widest">Job Brief</span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded-[3px] border uppercase tracking-wide ${
                isEmergency
                  ? 'bg-[rgba(239,68,68,0.12)] border-status-fail text-status-fail'
                  : 'bg-[rgba(245,158,11,0.1)] border-status-warn text-status-warn'
              }`}
            >
              {isEmergency ? 'Emergency' : 'Routine'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary">
            <MapPin size={11} className="text-text-tertiary shrink-0" />
            <span className="font-sans text-[13px] text-text-primary truncate">{m1Input.property}</span>
          </div>

          {m1Response && (
            <div className="flex items-center gap-1.5">
              <Wrench size={11} className="text-text-tertiary shrink-0" />
              <span className="font-mono text-[11px] text-text-secondary uppercase tracking-wide">
                {m1Response.service_line_id.replace(/-/g, ' ')}
              </span>
              <span className="text-text-tertiary mx-1">·</span>
              <span className="font-mono text-[11px] text-text-secondary">{m1Response.work_type}</span>
              {m1Response.asset && (
                <>
                  <span className="text-text-tertiary mx-1">·</span>
                  <span className="font-mono text-[11px] text-text-secondary">{m1Response.asset}</span>
                </>
              )}
            </div>
          )}

          {m1Response?.enriched_ticket_scope && (
            <p className="font-sans text-[12px] text-text-tertiary leading-relaxed line-clamp-2">
              {m1Response.enriched_ticket_scope}
            </p>
          )}
        </div>

        {/* Right: Quick stats */}
        <div className="flex flex-col gap-2 shrink-0 text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <Zap size={11} className="text-status-pass" />
            <span className="font-mono text-[11px] text-status-pass">Auto-Qualified</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <AIEngineIcon size={11} className="text-accent-ai" />
            <span className="font-mono text-[11px] text-accent-ai">{m1WorkActions.length} tasks generated</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock size={11} className="text-text-tertiary" />
            <span className="font-mono text-[11px] text-text-tertiary">Enriched in 2.4s</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProviderRecommendations() {
  const { state, dispatch } = useStore();
  const { m2Response } = state;
  const [drawerProvider, setDrawerProvider] = useState<ProviderScore | null>(null);

  if (!m2Response) return null;

  const topProviders = m2Response.providers.slice(0, 3);
  const allProviders = m2Response.providers;

  function handleSimulateJobCompletion() {
    const assignedProvider = topProviders[0];
    if (!assignedProvider) return;
    dispatch({ type: 'SET_ASSIGNED_PROVIDER', payload: assignedProvider });
    dispatch({ type: 'SET_STAGE', payload: 'module3' });
    dispatch({ type: 'SET_M3_SCREEN', payload: 'photos' });
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
      {/* Job brief card */}
      <JobBriefCard />

      {/* Headline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <p className="font-mono text-[11px] text-accent-ai uppercase tracking-widest mb-1">
          AI Recommended Providers
        </p>
        <p className="font-sans text-[14px] text-text-secondary">
          Ranked by fit, reliability, and availability for this job.
        </p>
      </motion.div>

      {/* Recommendation cards */}
      <div className="space-y-4">
        {topProviders.map((provider, i) => (
          <RecommendationCard
            key={provider.provider_id}
            provider={provider}
            rank={i + 1}
            delay={i * 0.15}
            onViewDetails={() => setDrawerProvider(provider)}
          />
        ))}
      </div>

      {/* Cost callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border border-border-subtle bg-bg-surface2 rounded-[6px] p-4 text-center"
      >
        <p className="font-sans text-[13px] text-text-secondary">
          Cost to DMG is not a factor in provider matching.
          We optimize for quality and speed — your contract rates govern the invoice.
        </p>
      </motion.div>

      {/* Full provider list */}
      <FullProviderList providers={allProviders} totalMatched={m2Response.total_matched} />

      {/* Filtration diagnostic */}
      {m2Response.filtration_stats && <FiltrationPanel stats={m2Response.filtration_stats} />}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={handleSimulateJobCompletion}
        className="w-full py-3 rounded-[6px] bg-accent-action text-white font-mono text-[13px] font-bold
                   tracking-[0.1em] uppercase hover:bg-[#d4561e] transition-colors flex items-center justify-center gap-2"
      >
        Simulate Job Completion →
      </motion.button>

      {/* Score drawer */}
      <ProviderScoreDrawer provider={drawerProvider} onClose={() => setDrawerProvider(null)} />
    </div>
  );
}
