import { motion } from 'framer-motion';
import { Wrench, Wind, Grid3X3 } from 'lucide-react';
import { useStore } from '@/state/store';
import { SCENARIOS } from '@/data/scenarios';

const SCENARIO_ICONS = {
  'hot-water-heater': Wrench,
  'hvac-not-cooling': Wind,
  'ceiling-tile-damage': Grid3X3,
};

export function ScenarioSelector() {
  const { dispatch } = useStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border-subtle bg-bg-surface1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
          <span className="font-mono text-[11px] text-accent-ai uppercase tracking-wider">Live Demo · Real AI Services</span>
        </div>
        <h1 className="font-sans text-[32px] font-600 text-text-primary mb-3 leading-tight">
          Choose a work order scenario
        </h1>
        <p className="font-sans text-[15px] text-text-secondary max-w-lg">
          Select a scenario to pre-fill the intake form. All AI processing runs live against DMG's production services.
        </p>
      </motion.div>

      {/* Scenario cards */}
      <div className="flex gap-5 flex-wrap justify-center max-w-4xl w-full">
        {SCENARIOS.map((scenario, i) => {
          const Icon = SCENARIO_ICONS[scenario.scenario_id as keyof typeof SCENARIO_ICONS] || Wrench;
          const isEmergency = scenario.urgency === 'emergency';

          return (
            <motion.button
              key={scenario.scenario_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SELECT_SCENARIO', payload: scenario.scenario_id })}
              className="card flex flex-col items-start gap-4 p-6 w-72 text-left cursor-pointer
                         hover:bg-bg-surface2 transition-all duration-200
                         hover:border-accent-ai hover:shadow-glow-ai group"
            >
              {/* Icon + badge row */}
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-[6px] bg-bg-surface2 border border-border-subtle flex items-center justify-center group-hover:border-accent-ai transition-colors">
                  <Icon size={18} className="text-text-secondary group-hover:text-accent-ai transition-colors" />
                </div>
                <span
                  className={`font-mono text-[11px] px-2 py-0.5 rounded-[3px] border uppercase tracking-wide ${
                    isEmergency
                      ? 'bg-[rgba(239,68,68,0.12)] border-status-fail text-status-fail'
                      : 'bg-[rgba(245,158,11,0.1)] border-status-warn text-status-warn'
                  }`}
                >
                  {isEmergency ? 'Emergency' : 'Routine'}
                </span>
              </div>

              {/* Title + service line */}
              <div>
                <h3 className="font-sans text-[16px] font-600 text-text-primary mb-1 group-hover:text-accent-ai transition-colors">
                  {scenario.label}
                </h3>
                <p className="font-mono text-[11px] text-text-tertiary uppercase tracking-wide">
                  {scenario.service_line}
                </p>
              </div>

              {/* Preview description */}
              <p className="font-sans text-[13px] text-text-tertiary leading-relaxed line-clamp-2">
                {scenario.input.description}
              </p>

              {/* CTA hint */}
              <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border-subtle w-full">
                <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
                  {scenario.input.customer}
                </span>
                <span className="ml-auto font-mono text-[11px] text-accent-ai opacity-0 group-hover:opacity-100 transition-opacity">
                  Select →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 font-mono text-[11px] text-text-tertiary text-center"
      >
        Form fields are pre-filled and editable. AI processing runs on real DMG infrastructure.
      </motion.p>
    </div>
  );
}
