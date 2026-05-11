import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { SCENARIOS } from '@/data/scenarios';

// Service-relevant icons as inline SVGs for maximum control
function PlumbingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function HVACIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M8 12h8M12 9v6"/>
      <circle cx="17" cy="9.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function MaintenanceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1"/>
      <rect x="13" y="3" width="8" height="8" rx="1"/>
      <rect x="3" y="13" width="8" height="8" rx="1"/>
      <rect x="13" y="13" width="8" height="8" rx="1"/>
    </svg>
  );
}

function LandscapingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 4 6 4 10c0 4 4 6 8 6s8-2 8-6c0-4-4-8-8-8z"/>
      <path d="M12 16v6"/>
      <path d="M8 20h8"/>
    </svg>
  );
}

function SnowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <path d="m20 7-8 5-8-5"/>
      <path d="m20 17-8-5-8 5"/>
      <path d="m2 12 5-3 5 3 5-3 5 3"/>
      <path d="m2 12 5 3 5-3 5 3 5-3"/>
    </svg>
  );
}

function CustomIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC> = {
  'hot-water-heater': PlumbingIcon,
  'hvac-not-cooling': HVACIcon,
  'ceiling-tile-damage': MaintenanceIcon,
  'routine-landscaping': LandscapingIcon,
  'snow-removal': SnowIcon,
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
          const Icon = ICON_MAP[scenario.scenario_id] || MaintenanceIcon;
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
                <div className="w-9 h-9 rounded-[6px] bg-bg-surface2 border border-border-subtle flex items-center justify-center group-hover:border-accent-ai transition-colors text-text-secondary group-hover:text-accent-ai">
                  <Icon />
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
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-border-subtle group-hover:border-accent-ai flex items-center justify-center transition-colors">
            <CustomIcon />
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
