import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, ChevronDown, ArrowRight } from 'lucide-react';
import { useStore } from '@/state/store';
import { qualify, match } from '@/api/client';
import type { QualifyRequest } from '@/api/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TaskCard } from './TaskCard';
import { AIEngineIcon } from '@/components/shared/AIEngineIcon';

// ─── Left column: intake form ─────────────────────────────────────────────────

function IntakeColumn({ loading }: { loading: boolean }) {
  const { state, dispatch } = useStore();
  const { m1Input } = state;
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`flex flex-col gap-4 transition-opacity duration-500 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <div className="mb-1">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-1">Customer Input</p>
        <div className="h-px bg-border-subtle" />
      </div>

      <Field label="Property / Location">
        <input
          type="text"
          value={m1Input.property}
          onChange={(e) => dispatch({ type: 'SET_M1_INPUT', payload: { property: e.target.value } })}
          className="form-input"
          placeholder="e.g. National Pharmacy – Austin, TX"
        />
      </Field>

      <Field label="Work Description">
        <textarea
          rows={4}
          value={m1Input.description}
          onChange={(e) => dispatch({ type: 'SET_M1_INPUT', payload: { description: e.target.value } })}
          className="form-input resize-none"
          placeholder="Describe the issue in plain language."
        />
      </Field>

      <Field label="Service Line">
        <select
          value={m1Input.service_line_input ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_M1_INPUT',
              payload: { service_line_input: e.target.value || null },
            })
          }
          className="form-input"
        >
          <option value="">Leave blank — AI will predict</option>
          <option value="plumbing">Plumbing</option>
          <option value="hvac">HVAC</option>
          <option value="electrical">Electrical</option>
          <option value="general-maintenance">General Maintenance</option>
          <option value="landscaping">Landscaping</option>
          <option value="snow-removal">Snow &amp; Ice</option>
          <option value="roofing">Roofing</option>
        </select>
      </Field>

      <Field label="Attach Photos" hint="Optional">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
          }}
          onClick={() => fileRef.current?.click()}
          className="border border-dashed border-border-subtle rounded-[6px] p-3 flex items-center gap-2 cursor-pointer hover:border-text-tertiary transition-colors"
        >
          <Upload size={14} className="text-text-tertiary" />
          <span className="font-sans text-[12px] text-text-tertiary">Drop photos or click to browse</span>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
          />
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-bg-surface2 border border-border-subtle">
                <span className="font-mono text-[10px] text-text-secondary">{f.name}</span>
                <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                  <X size={9} className="text-text-tertiary hover:text-status-fail" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <style>{`
        .form-input { width:100%; padding:8px 12px; background:#0F1D35; border:1px solid #1A2D45; border-radius:6px; color:#EEF2F7; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border-color 0.15s; }
        .form-input:focus { border-color:#00C4E8; }
        .form-input option { background:#0F1D35; color:#EEF2F7; }
      `}</style>
    </div>
  );
}

// ─── Center column: AI trigger + live status ──────────────────────────────────

const PHASES = [
  { label: 'Parsing work description & image context', duration: 900 },
  { label: 'Scanning customer-specific rules and configuration', duration: 1100 },
  { label: 'Complexity evaluation against 20M+ historical jobs', duration: 1000 },
  { label: 'Generating task list and provider guidance', duration: 800 },
];

function CenterColumn({
  m1Screen,
  onSubmit,
}: {
  m1Screen: string;
  onSubmit: () => void;
}) {
  const [activePhase, setActivePhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const startedRef = useRef(false);

  // Kick off phase animation when processing starts
  if (m1Screen === 'processing' && !startedRef.current) {
    startedRef.current = true;
    let elapsed = 200;
    PHASES.forEach((phase, i) => {
      setTimeout(() => setActivePhase(i), elapsed);
      setTimeout(() => setCompletedPhases((prev) => [...prev, i]), elapsed + phase.duration);
      elapsed += phase.duration + 150;
    });
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="mb-1 w-full">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-1 text-center">AI Engine</p>
        <div className="h-px bg-border-subtle" />
      </div>

      {/* Arrow showing flow direction */}
      <div className="flex items-center gap-3 text-text-tertiary">
        <div className="h-px w-8 bg-border-subtle" />
        <ArrowRight size={14} className="text-accent-ai" />
        <div className="h-px w-8 bg-border-subtle" />
      </div>

      <AnimatePresence mode="wait">
        {m1Screen === 'form' && (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={onSubmit}
              className="flex flex-col items-center gap-2 px-6 py-5 rounded-[8px] bg-accent-action hover:bg-[#d4561e] transition-colors text-white group"
            >
              <AIEngineIcon size={28} className="group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-center leading-tight">
                Run DMG<br />Work Enrichment AI
              </span>
            </button>
            <p className="font-mono text-[10px] text-text-tertiary text-center max-w-[140px] leading-relaxed">
              AI enriches, classifies, and generates tasks
            </p>
          </motion.div>
        )}

        {m1Screen === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-3"
          >
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="relative">
                <AIEngineIcon size={32} className="text-accent-ai animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-accent-ai opacity-10 animate-ping" />
              </div>
              <span className="font-mono text-[10px] text-accent-ai uppercase tracking-widest animate-pulse">
                Processing...
              </span>
            </div>

            {PHASES.map((phase, i) => {
              const isDone = completedPhases.includes(i);
              const isActive = activePhase === i && !isDone;
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isDone ? 'border-status-pass bg-[rgba(16,185,129,0.15)]' :
                    isActive ? 'border-accent-ai bg-[rgba(0,196,232,0.1)]' :
                    'border-border-subtle'
                  }`}>
                    {isDone ? <Check size={9} className="text-status-pass" /> :
                     isActive ? <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" /> : null}
                  </div>
                  <span className={`font-mono text-[11px] leading-tight transition-colors ${
                    isDone ? 'text-text-secondary' : isActive ? 'text-text-primary' : 'text-text-tertiary'
                  }`}>
                    {phase.label}
                    {isActive && <span className="animate-pulse">...</span>}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}

        {m1Screen === 'output' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.15)] border border-status-pass flex items-center justify-center">
              <Check size={20} className="text-status-pass" />
            </div>
            <div className="text-center">
              <p className="font-mono text-[11px] text-status-pass uppercase tracking-wider">Complete</p>
              <p className="font-mono text-[10px] text-text-tertiary mt-1">Generated in 2.4s</p>
            </div>
            <AIEngineIcon size={16} className="text-text-tertiary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Right column: enriched output ────────────────────────────────────────────

function AccuracyBar({ label, value, threshold }: { label: string; value: number; threshold: number }) {
  const pass = value >= threshold;
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-text-tertiary w-20 shrink-0">{label}</span>
      <span className="font-mono text-[12px] text-text-primary w-9 shrink-0">{value}%</span>
      <div className="flex-1 h-1 rounded-full bg-bg-surface2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: pass ? '#10B981' : '#F59E0B' }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {pass && <Check size={10} className="text-status-pass shrink-0" />}
    </div>
  );
}

function GuardrailInline() {
  const [open, setOpen] = useState(true);
  return (
    <div className="card border-l-2 border-l-accent-ai text-[13px]">
      <button className="w-full flex items-center justify-between px-4 py-3" onClick={() => setOpen((o) => !o)}>
        <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">Auto-Qualification Status</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-status-pass">✅ APPROVED</span>
          <ChevronDown size={12} className={`text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-border-subtle space-y-2 pt-3">
              <AccuracyBar label="L15 Accuracy" value={97} threshold={85} />
              <AccuracyBar label="L30 Accuracy" value={95} threshold={85} />
              <p className="font-sans text-[12px] text-text-secondary pt-1">
                Qualifies for automatic dispatch — no manual review required.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OutputColumn({ m1Response, m1WorkActions, onSendToMarketplace }: {
  m1Response: NonNullable<ReturnType<typeof useStore>['state']['m1Response']>;
  m1WorkActions: ReturnType<typeof useStore>['state']['m1WorkActions'];
  onSendToMarketplace: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-1">AI Enriched Output</p>
        <div className="h-px bg-accent-ai opacity-40" />
      </div>

      {/* Raw vs enriched */}
      <div className="grid grid-cols-1 gap-3">
        <div className="card p-3 bg-bg-surface2">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-ai" />
            <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider">Enriched Scope</span>
          </div>
          <p className="font-sans text-[13px] text-text-primary leading-relaxed">
            {m1Response.enriched_ticket_scope}
          </p>
        </div>
      </div>

      {/* Classification chips */}
      <div className="flex flex-wrap gap-1.5">
        <ClassBadge label="Service Line" value={m1Response.service_line_id.replace(/-/g, ' ').toUpperCase()} variant="ai" />
        <ClassBadge label="Work Type" value={m1Response.work_type} variant="ai" />
        <ClassBadge label="Asset" value={m1Response.asset || 'N/A'} variant="ai" />
        <ClassBadge label="Complexity" value={m1Response.work_complexity} variant={m1Response.work_complexity === 'SIMPLE' ? 'pass' : 'warn'} />
        <ClassBadge label="Recall Risk" value="None" variant="pass" />
        <ClassBadge label="Estimate Req" value={m1Response.is_estimate ? 'Yes' : 'No'} variant={m1Response.is_estimate ? 'warn' : 'pass'} />
      </div>

      {/* Work scope */}
      <div className="card p-4">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Work Scope</p>
        <p className="font-sans text-[13px] text-text-primary leading-[1.7]">{m1Response.work_scope}</p>
        {m1Response.special_instructions && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Special Instructions</p>
            <p className="font-sans text-[12px] text-status-warn leading-relaxed">{m1Response.special_instructions}</p>
          </div>
        )}
      </div>

      {/* Task list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">AI-Generated Tasks</p>
          <span className="font-mono text-[10px] text-text-tertiary">{m1WorkActions.length} tasks</span>
        </div>
        <div className="space-y-2">
          {m1WorkActions.map((action, i) => (
            <TaskCard key={action.action_id} action={action} index={i} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* Auto-qualification guardrail */}
      <GuardrailInline />

      {/* CTA */}
      <button
        onClick={onSendToMarketplace}
        className="w-full py-3 rounded-[6px] bg-accent-action text-white font-mono text-[12px] font-bold
                   tracking-[0.1em] uppercase hover:bg-[#d4561e] transition-colors flex items-center justify-center gap-2"
      >
        <AIEngineIcon size={14} />
        Send to Marketplace Matching →
      </button>
    </div>
  );
}

// ─── Main Module1Screen component ─────────────────────────────────────────────

export function Module1Screen() {
  const { state, dispatch } = useStore();
  const { m1Screen, m1Input, m1Response, m1WorkActions } = state;

  const loading = m1Screen === 'processing';

  async function handleSubmit() {
    if (!m1Input.description.trim()) return;
    dispatch({ type: 'SET_M1_SCREEN', payload: 'processing' });

    const req: QualifyRequest = {
      ticket_scope: m1Input.description,
      image_attachment_ids: [],
      service_line_id: m1Input.service_line_input,
    };

    try {
      const result = await qualify(req);
      dispatch({ type: 'SET_M1_RESPONSE', payload: result.prediction });
      dispatch({ type: 'SET_M1_WORK_ACTIONS', payload: result.workActions });
      dispatch({ type: 'SET_M1_SCREEN', payload: 'output' });
    } catch {
      dispatch({ type: 'SET_M1_SCREEN', payload: 'form' });
    }
  }

  function handleSendToMarketplace() {
    dispatch({ type: 'SET_STAGE', payload: 'module2' });
    dispatch({ type: 'SET_M2_SCREEN', payload: 'processing' });
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
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-5">
      <div className="grid grid-cols-[1fr_148px_1fr] gap-5 w-full max-w-[1600px] mx-auto">
        {/* Left: intake form */}
        <IntakeColumn loading={loading} />

        {/* Center: AI engine */}
        <CenterColumn m1Screen={m1Screen} onSubmit={handleSubmit} />

        {/* Right: enriched output */}
        <div className="relative">
          <AnimatePresence>
            {m1Screen === 'form' && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-subtle flex items-center justify-center">
                  <AIEngineIcon size={24} className="text-text-tertiary opacity-40" />
                </div>
                <p className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider text-center">
                  Enriched output<br />appears here
                </p>
              </motion.div>
            )}

            {m1Screen === 'processing' && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="mb-1">
                  <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-1">AI Enriched Output</p>
                  <div className="h-px bg-accent-ai opacity-20" />
                </div>
                {[80, 100, 60, 90, 70].map((w, i) => (
                  <div key={i} className={`h-3 rounded bg-bg-surface2 animate-pulse`} style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </motion.div>
            )}

            {m1Screen === 'output' && m1Response && (
              <motion.div
                key="output"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <OutputColumn
                  m1Response={m1Response}
                  m1WorkActions={m1WorkActions}
                  onSendToMarketplace={handleSendToMarketplace}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function ClassBadge({ label, value, variant }: { label: string; value: string; variant: 'ai' | 'pass' | 'warn' | 'fail' | 'slate' }) {
  return (
    <div className="flex items-center gap-1.5 card px-2 py-1">
      <span className="font-mono text-[10px] text-text-tertiary">{label}</span>
      <StatusBadge variant={variant}>{value}</StatusBadge>
    </div>
  );
}

function Field({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        <label className="font-sans text-[12px] font-500 text-text-secondary">{label}</label>
        {hint && <span className="font-sans text-[10px] text-text-tertiary">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
