import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { RecommendationCard } from './RecommendationCard';
import { ProviderScoreDrawer } from './ProviderScoreDrawer';
import { FullProviderList } from './FullProviderList';
import { FiltrationPanel } from './FiltrationPanel';
import type { ProviderScore } from '@/data/types';

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
      {/* Headline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="font-mono text-[11px] text-accent-ai uppercase tracking-widest mb-1">
          AI RECOMMENDED PROVIDERS
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
            delay={i * 0.2}
            onViewDetails={() => setDrawerProvider(provider)}
          />
        ))}
      </div>

      {/* Cost callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border border-accent-ai bg-[rgba(0,196,232,0.04)] rounded-[6px] p-4 text-center"
      >
        <p className="font-sans text-[13px] text-text-secondary">
          Cost to DMG is not a factor in provider matching.
          We optimize for quality and speed. Your contract rates govern the invoice.
        </p>
      </motion.div>

      {/* Full provider list */}
      <FullProviderList providers={allProviders} totalMatched={m2Response.total_matched} />

      {/* Filtration diagnostic */}
      {m2Response.filtration_stats && (
        <FiltrationPanel stats={m2Response.filtration_stats} />
      )}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={handleSimulateJobCompletion}
        className="w-full py-3 rounded-[6px] bg-accent-action text-white font-sans text-[16px] font-500
                   hover:bg-[#d4561e] transition-colors flex items-center justify-center gap-2"
      >
        Simulate Job Completion →
      </motion.button>

      {/* Score drawer */}
      <ProviderScoreDrawer provider={drawerProvider} onClose={() => setDrawerProvider(null)} />
    </div>
  );
}
