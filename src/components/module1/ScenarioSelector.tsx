import { motion } from 'framer-motion';
import { Flame, Thermometer, Wrench, Leaf, Snowflake, Plus, type LucideIcon } from 'lucide-react';
import { useStore } from '@/state/store';
import { SCENARIOS } from '@/data/scenarios';

const ICON_MAP: Record<string, LucideIcon> = {
  'hot-water-heater': Flame,
  'hvac-not-cooling': Thermometer,
  'ceiling-tile-damage': Wrench,
  'routine-landscaping': Leaf,
  'snow-removal': Snowflake,
};

const URGENCY_LABEL: Record<string, string> = {
  emergency: 'Emergency',
  routine: 'Routine',
};

export function ScenarioSelector() {
  const { dispatch } = useStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <h1 className="font-mono text-[28px] font-bold tracking-[0.06em] text-text-primary uppercase mb-2">
          Choose a Scenario
        </h1>
        <p className="font-sans text-[14px] text-text-secondary">
          Select a pre-loaded work order or build your own from scratch.
        </p>
      </motion.div>

      {/* 2×3 grid */}
      <div className="grid grid-cols-3 gap-4 max-w-[860px] w-full">
        {SCENARIOS.map((scenario, i) => {
          const Icon = ICON_MAP[scenario.scenario_id] || Wrench;
          const isEmergency = scenario.urgency === 'emergency';

          return (
            <motion.button
              key={scenario.scenario_id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SELECT_SCENARIO', payload: scenario.scenario_id })}
              className="card flex flex-col items-start gap-3 p-5 text-left cursor-pointer
                         hover:bg-bg-surface2 transition-all duration-200
                         hover:border-accent-ai hover:shadow-glow-ai group"
            >
              {/* Icon + badge */}
              <div className="flex items-center justify-between w-full">
                <div className="w-9 h-9 rounded-[6px] bg-bg-surface2 border border-border-subtle flex items-center justify-center group-hover:border-accent-ai group-hover:bg-[rgba(0,196,232,0.08)] transition-all text-text-secondary group-hover:text-accent-ai">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-[3px] border uppercase tracking-wide ${
                    isEmergency
                      ? 'bg-[rgba(239,68,68,0.12)] border-status-fail text-status-fail'
                      : 'bg-[rgba(245,158,11,0.1)] border-status-warn text-status-warn'
                  }`}
                >
                  {URGENCY_LABEL[scenario.urgency]}
                </span>
              </div>

              {/* Title + service line */}
              <div>
                <h3 className="font-sans text-[15px] font-600 text-text-primary mb-0.5 group-hover:text-accent-ai transition-colors leading-tight">
                  {scenario.label}
                </h3>
                <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wide">
                  {scenario.service_line}
                </p>
              </div>

              {/* Description */}
              <p className="font-sans text-[12px] text-text-tertiary leading-relaxed line-clamp-2 flex-1">
                {scenario.input.description}
              </p>

              {/* Site profile + CTA */}
              <div className="flex items-center justify-between w-full pt-2 border-t border-border-subtle">
                <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wide">
                  {'site_profile' in scenario ? String(scenario.site_profile) : ''}
                </span>
                <span className="font-mono text-[10px] text-accent-ai opacity-0 group-hover:opacity-100 transition-opacity">
                  Select →
                </span>
              </div>
            </motion.button>
          );
        })}

        {/* Create Your Own tile */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: SCENARIOS.length * 0.07 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: 'SELECT_SCENARIO', payload: 'custom' })}
          className="card flex flex-col items-center justify-center gap-3 p-5 text-left cursor-pointer
                     border-dashed hover:border-accent-ai transition-all duration-200 group min-h-[180px]"
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-border-subtle group-hover:border-accent-ai group-hover:bg-[rgba(0,196,232,0.08)] flex items-center justify-center transition-all text-text-tertiary group-hover:text-accent-ai">
            <Plus size={20} strokeWidth={1.6} />
          </div>
          <div className="text-center">
            <p className="font-mono text-[13px] font-bold text-text-secondary group-hover:text-accent-ai transition-colors uppercase tracking-wider">
              Create Your Own
            </p>
            <p className="font-sans text-[11px] text-text-tertiary mt-1">
              Start from a blank intake form
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
