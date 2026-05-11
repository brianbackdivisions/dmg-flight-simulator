import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/state/store';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TaskCard } from './TaskCard';
import { GuardrailPanel } from './GuardrailPanel';

export function EnrichedOutput() {
  const { state, dispatch } = useStore();
  const { m1Response, m1Input, m1WorkActions } = state;

  if (!m1Response) return null;

  function handleSendToMarketplace() {
    dispatch({ type: 'SET_STAGE', payload: 'module2' });
    dispatch({ type: 'SET_M2_SCREEN', payload: 'processing' });

    // Kick off the match call in the background
    import('@/api/client').then(({ match }) => {
      match({
        service_line_id: m1Response!.service_line_id,
        service_type_id: m1Response!.service_type_id,
        property_id: 'DEMO_HEARTLAND_BLOOMINGTON_IL',
        is_emergency: m1Input.urgency === 'emergency',
        minimum_matching_score: 60,
        minimum_providers_required: 3,
      }).then((result) => {
        dispatch({ type: 'SET_M2_RESPONSE', payload: result });
        dispatch({ type: 'SET_M2_SCREEN', payload: 'results' });
      });
    });
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-8">
      {/* Before / After split */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Raw input */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-status-warn" />
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">Raw Input</span>
          </div>
          <p className="font-sans text-[14px] text-text-secondary leading-relaxed bg-bg-surface2 p-3 rounded border border-border-subtle">
            {m1Input.description}
          </p>
        </div>

        {/* AI enriched */}
        <div className="card p-4 bg-bg-surface2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-ai" />
            <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">AI Enriched Output</span>
          </div>
          <p className="font-sans text-[14px] text-text-primary leading-relaxed">
            {m1Response.enriched_ticket_scope}
          </p>
        </div>
      </motion.div>

      {/* Arrow + timing */}
      <div className="flex items-center justify-center gap-3">
        <ArrowRight size={16} className="text-accent-ai" />
        <span className="font-mono text-[12px] text-text-tertiary">Generated in 2.4s</span>
      </div>

      {/* Classification strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <ClassBadge label="SERVICE LINE" value={m1Response.service_line_id.replace(/-/g, ' ').toUpperCase()} variant="ai" />
        <ClassBadge label="WORK TYPE" value={m1Response.work_type} variant="ai" />
        <ClassBadge label="ASSET" value={m1Response.asset || 'Commercial Water Heater'} variant="ai" />
        <ClassBadge label="COMPLEXITY" value={m1Response.work_complexity} variant={m1Response.work_complexity === 'SIMPLE' ? 'pass' : 'warn'} />
        <ClassBadge label="URGENCY" value={m1Input.urgency.toUpperCase()} variant={m1Input.urgency === 'emergency' ? 'fail' : 'warn'} />
        <ClassBadge label="RECALL RISK" value="None detected" variant="pass" />
        <ClassBadge label="ESTIMATE REQ" value={m1Response.is_estimate ? 'Yes' : 'No'} variant={m1Response.is_estimate ? 'warn' : 'pass'} />
        <ClassBadge label="PARTS ORDER" value={m1Response.is_parts_and_order ? 'Yes' : 'No'} variant={m1Response.is_parts_and_order ? 'warn' : 'pass'} />
        <ClassBadge label="PROJECT WORK" value={m1Response.is_project_work ? 'Yes' : 'No'} variant={m1Response.is_project_work ? 'warn' : 'pass'} />
      </motion.div>

      {/* Work scope */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Work Scope</p>
        <div className="w-full h-px bg-border-subtle mb-4" />
        <p className="font-sans text-[15px] text-text-primary leading-[1.7]">{m1Response.work_scope}</p>

        {m1Response.special_instructions && (
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Special Instructions</p>
            <p className="font-sans text-[14px] text-status-warn leading-relaxed">
              {m1Response.special_instructions}
            </p>
          </div>
        )}
      </motion.div>

      {/* Task list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
            AI-Generated Task List
          </h2>
          <span className="font-mono text-[12px] text-text-tertiary">
            {m1WorkActions.length} tasks
          </span>
        </div>
        <div className="space-y-2">
          {m1WorkActions.map((action, i) => (
            <TaskCard key={action.action_id} action={action} index={i} delay={i * 0.12} />
          ))}
        </div>
      </div>

      {/* Guardrail panel */}
      <GuardrailPanel />

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleSendToMarketplace}
        className="w-full py-3 rounded-[6px] bg-accent-action text-white font-sans text-[16px] font-500
                   hover:bg-[#d4561e] transition-colors flex items-center justify-center gap-2"
      >
        Send to Marketplace →
      </motion.button>
    </div>
  );
}

function ClassBadge({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: 'ai' | 'pass' | 'warn' | 'fail' | 'slate';
}) {
  return (
    <div className="flex items-center gap-1.5 card px-3 py-1.5">
      <span className="font-mono text-[10px] text-text-tertiary">{label}</span>
      <StatusBadge variant={variant}>{value}</StatusBadge>
    </div>
  );
}
