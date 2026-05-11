import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '@/state/store';
import { AIEngineIcon } from '@/components/shared/AIEngineIcon';
import { ConfidenceLevel, WorkCompletionStatus } from '@/data/types';
import { getScenario } from '@/data/scenarios';

function StatTile({
  value,
  label,
  sub,
  variant = 'default',
  delay = 0,
}: {
  value: string;
  label: string;
  sub?: string;
  variant?: 'default' | 'pass' | 'ai' | 'action';
  delay?: number;
}) {
  const valueColors = {
    default: 'text-text-primary',
    pass: 'text-status-pass',
    ai: 'text-accent-ai',
    action: 'text-accent-action',
  };
  const borderColors = {
    default: 'border-border-subtle',
    pass: 'border-status-pass',
    ai: 'border-accent-ai',
    action: 'border-accent-action',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`card p-4 ${borderColors[variant] !== 'border-border-subtle' ? `border-l-2 border-l-${borderColors[variant].replace('border-', '')}` : ''}`}
    >
      <p className={`font-mono text-[28px] font-bold leading-none mb-1 ${valueColors[variant]}`}>
        {value}
      </p>
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-0.5">{label}</p>
      {sub && <p className="font-sans text-[12px] text-text-secondary leading-tight">{sub}</p>}
    </motion.div>
  );
}

export function SummaryScreen() {
  const { state, dispatch } = useStore();
  const { m1Response, m1WorkActions, m2Response, m3Response, assignedProvider, m1Input, selectedScenario } = state;

  const scenario = selectedScenario ? getScenario(selectedScenario) : null;
  const urgency = (scenario as { urgency?: string } | undefined)?.urgency ?? m1Input.urgency;

  // Derived values
  const providerCount = m2Response?.total_matched ?? 40;
  const providerName = assignedProvider?.provider_name ?? 'Summit Plumbing Solutions';
  const distanceMiles = assignedProvider?.provider_property_distance_in_miles ?? 6.2;
  const eta = distanceMiles < 8 ? '< 30 min' : distanceMiles < 13 ? '~45 min' : '~1 hr';
  const taskCount = m1WorkActions.length || 4;

  const confidence = m3Response?.verification_results?.work_completion_confidence;
  const completionStatus = m3Response?.verification_results?.work_completion_status;
  const isComplete = completionStatus === WorkCompletionStatus.WORK_COMPLETION_STATUS_COMPLETE;
  const isHighConf = confidence === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH;
  const zeroTouch = isComplete && isHighConf;

  const confidenceLabel =
    confidence === ConfidenceLevel.CONFIDENCE_LEVEL_HIGH ? 'HIGH'
    : confidence === ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM ? 'MEDIUM'
    : confidence === ConfidenceLevel.CONFIDENCE_LEVEL_LOW ? 'LOW'
    : 'HIGH';

  const behaviorLabels = assignedProvider?.behavior_labels ?? ['property_veteran', 'reliable_acceptor'];
  const serviceLine = m1Response?.service_line_id?.replace(/-/g, ' ').replace('svc line ', '').toUpperCase() ?? 'PLUMBING';

  // Pipeline stages
  const pipelineStages = [
    { num: '01', label: 'Qualification & Enrichment', timing: '2.4s', done: !!m1Response },
    { num: '02', label: 'Marketplace Matching', timing: '7.1s', done: !!m2Response },
    { num: '03', label: 'Quality Verification', timing: '3.1s', done: !!m3Response },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-status-pass" />
              <span className="font-mono text-[11px] text-status-pass uppercase tracking-widest">
                Job Complete — AI Debrief
              </span>
            </div>
            <h1 className="font-mono text-[22px] font-bold text-text-primary tracking-tight">
              {m1Input.property || 'Job Site'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wide">{serviceLine}</span>
              <span className="text-text-tertiary">·</span>
              <span
                className={`font-mono text-[11px] uppercase ${
                  urgency === 'emergency' ? 'text-status-fail' : 'text-status-warn'
                }`}
              >
                {urgency === 'emergency' ? 'Emergency' : 'Routine'}
              </span>
              {zeroTouch && (
                <>
                  <span className="text-text-tertiary">·</span>
                  <span className="font-mono text-[11px] text-status-pass uppercase">Zero-Touch Approved</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[rgba(16,185,129,0.1)] border border-status-pass">
            <Check size={14} className="text-status-pass" />
            <span className="font-mono text-[11px] text-status-pass uppercase tracking-wider">
              {zeroTouch ? 'Auto-Approved' : 'Verified'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── 6-tile stat grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <StatTile
          value={String(providerCount)}
          label="Providers in Market"
          sub={`Matched in ${serviceLine.toLowerCase()} · ${m1Input.property?.split('–')?.[1]?.trim() ?? 'local area'}`}
          variant="ai"
          delay={0.05}
        />
        <StatTile
          value={eta}
          label="Estimated Arrival"
          sub={`${providerName} · ${distanceMiles} mi away`}
          variant="pass"
          delay={0.1}
        />
        <StatTile
          value={`${taskCount}/${taskCount}`}
          label="Tasks AI-Verified"
          sub="All essential tasks confirmed complete"
          variant="pass"
          delay={0.15}
        />
        <StatTile
          value="9"
          label="Photos Analyzed"
          sub="3 before · 3 during · 3 after"
          variant="ai"
          delay={0.2}
        />
        <StatTile
          value={confidenceLabel}
          label="Verification Confidence"
          sub={isComplete ? 'Work completion confirmed' : 'See verification report'}
          variant={confidenceLabel === 'HIGH' ? 'pass' : 'default'}
          delay={0.25}
        />
        <StatTile
          value={zeroTouch ? 'Zero-Touch' : isComplete ? 'OC Review' : 'Manual'}
          label="Invoice Path"
          sub={zeroTouch ? 'Invoice proceeds automatically' : 'Routed to operations center'}
          variant={zeroTouch ? 'pass' : 'default'}
          delay={0.3}
        />
      </div>

      {/* ── Provider & matching signals ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <AIEngineIcon size={12} className="text-accent-ai" />
          <span className="font-mono text-[10px] text-accent-ai uppercase tracking-widest">
            Routing & Matching Signals
          </span>
        </div>
        <div className="h-px bg-border-subtle mb-4" />

        <div className="grid grid-cols-2 gap-6">
          {/* Provider signals */}
          <div>
            <p className="font-sans text-[13px] font-600 text-text-primary mb-2">{providerName}</p>
            <div className="space-y-1.5">
              {behaviorLabels.map((label) => {
                const readable: Record<string, string> = {
                  property_veteran: `Property veteran — prior jobs at this location`,
                  reliable_acceptor: 'Reliable acceptor — high acceptance rate',
                  customer_veteran: 'Customer veteran — multi-site history',
                  high_performance_score: 'High performance scorecard',
                  on_time_arrival: 'Strong on-time arrival record',
                  defect_free_completion: 'Defect-free completion history',
                  active_viewer: 'Active on job board',
                };
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-accent-ai shrink-0" />
                    <span className="font-sans text-[13px] text-text-secondary">
                      {readable[label] ?? label.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-status-pass shrink-0" />
                <span className="font-sans text-[13px] text-text-secondary">No active capacity constraints</span>
              </div>
            </div>
          </div>

          {/* Filtration signals */}
          <div>
            <p className="font-sans text-[13px] font-600 text-text-primary mb-2">Why Others Were Filtered</p>
            <div className="space-y-1.5">
              {(m2Response?.filtration_stats ?? [
                { reason: 'Insurance lapsed or missing', count: 14 },
                { reason: 'No active license for trade', count: 8 },
                { reason: 'Outside geographic coverage', count: 22 },
              ]).slice(0, 4).map((stat) => (
                <div key={stat.reason} className="flex items-center justify-between">
                  <span className="font-sans text-[12px] text-text-tertiary">
                    {stat.reason.toLowerCase().replace(/^(.)/, (c) => c.toUpperCase())}
                  </span>
                  <span className="font-mono text-[11px] text-text-tertiary">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Pipeline timeline ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex items-stretch gap-0"
      >
        {pipelineStages.map((stage, i) => (
          <div key={stage.num} className="flex items-stretch flex-1">
            {i > 0 && (
              <div className="flex items-center px-2">
                <div className="flex items-center gap-1 text-accent-ai">
                  <div className="w-4 h-px bg-accent-ai" />
                  <span className="font-mono text-[10px]">›</span>
                  <div className="w-4 h-px bg-accent-ai" />
                </div>
              </div>
            )}
            <div className={`card flex-1 p-4 ${stage.done ? 'border-l-2 border-l-status-pass' : ''}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-mono text-[10px] text-text-tertiary">{stage.num}</span>
                {stage.done && <Check size={9} className="text-status-pass" />}
              </div>
              <p className="font-mono text-[11px] text-text-primary uppercase tracking-wider leading-tight mb-1">
                {stage.label}
              </p>
              <p className="font-mono text-[10px] text-accent-ai">{stage.timing}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── CTAs ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex items-center justify-center gap-4 pt-2"
      >
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-6 py-2.5 rounded-[6px] bg-bg-surface2 border border-border-subtle text-text-secondary font-mono text-[12px] uppercase tracking-wider hover:border-text-tertiary transition-colors"
        >
          Restart Demo
        </button>
        <button className="px-6 py-2.5 rounded-[6px] bg-accent-action text-white font-mono text-[12px] uppercase tracking-wider hover:bg-[#d4561e] transition-colors flex items-center gap-2">
          <AIEngineIcon size={12} />
          Talk to Us
        </button>
      </motion.div>
    </div>
  );
}
