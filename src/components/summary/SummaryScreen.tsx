import { motion } from 'framer-motion';
import { useStore } from '@/state/store';

export function SummaryScreen() {
  const { state, dispatch } = useStore();
  const { m1Response, m2Response, m3Response } = state;

  const stages = [
    {
      title: 'QUALIFICATION',
      stats: [
        `${m1Response ? '8' : '—'} AI predictions`,
        `${m1Response ? '4' : '—'} tasks defined`,
        'Generated: 2.4s',
      ],
    },
    {
      title: 'MARKETPLACE',
      stats: [
        `${m2Response ? m2Response.total_matched : '—'} providers`,
        'scored & ranked',
        'Matched: 3.2s',
      ],
    },
    {
      title: 'VERIFICATION',
      stats: [
        m3Response ? 'COMPLETE' : '—',
        'HIGH confidence',
        'Invoice: Ready',
      ],
    },
  ];

  const outcomeStats = [
    {
      stat: '84%',
      heading: 'SPEED',
      sub: '84% of emergencies completed first visit',
      caption: 'AI intake and automated matching eliminate dispatch delay',
    },
    {
      stat: '100%',
      heading: 'QUALITY',
      sub: '100% of jobs DMG-verified before invoicing',
      caption: 'Every job reviewed against AI-generated criteria',
    },
    {
      stat: '10%',
      heading: 'COST',
      sub: '10% average reduction in invoice variance',
      caption: 'Contract rules and verified time prevent overbilling',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12 space-y-10">
      {/* Three-stage timeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 flex-wrap justify-center"
      >
        {stages.map((stage, i) => (
          <div key={stage.title} className="flex items-center gap-4">
            {i > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-6 h-px bg-accent-ai" />
                <span className="font-mono text-[12px] text-accent-ai">&gt;&gt;</span>
                <div className="w-6 h-px bg-accent-ai" />
              </div>
            )}
            <div className="card p-5 w-52">
              <p className="font-mono text-[10px] text-accent-ai uppercase tracking-widest mb-3">
                {stage.title}
              </p>
              <div className="space-y-1">
                {stage.stats.map((s, j) => (
                  <p key={j} className="font-sans text-[13px] text-text-secondary">
                    {s}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Outcome stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-8 max-w-3xl w-full"
      >
        {outcomeStats.map((item) => (
          <div key={item.heading} className="text-center space-y-2">
            <p className="font-mono text-[32px] text-accent-ai font-500">{item.stat}</p>
            <p className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">{item.heading}</p>
            <p className="font-sans text-[13px] text-text-primary font-500">{item.sub}</p>
            <p className="font-sans text-[12px] text-text-secondary">{item.caption}</p>
          </div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-4"
      >
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-6 py-2.5 rounded-[6px] bg-bg-surface2 border border-border-subtle text-text-secondary font-sans text-[14px] hover:border-text-tertiary transition-colors"
        >
          Restart Demo
        </button>
        <button className="px-6 py-2.5 rounded-[6px] bg-accent-action text-white font-sans text-[14px] font-500 hover:bg-[#d4561e] transition-colors">
          Talk to Us
        </button>
      </motion.div>
    </div>
  );
}
