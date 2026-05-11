import { motion } from 'framer-motion';
import { Shield, Check, AlertTriangle, DollarSign } from 'lucide-react';
import type { LaborHoursAssessment } from '@/data/types';

// ─── Mock invoice data (hot-water-heater scenario) ────────────────────────────
//
// In production this would come from the billing engine. For the demo we show
// realistic numbers: provider submitted 3.5 hrs; GPS verified 1h 47min;
// AI predicted range was 1h 15min – 2h 30min. System auto-adjusted the invoice
// to the GPS-verified time, protecting the customer from the inflated claim.

const LABOR_SUBMITTED_HRS = 3.5;
const LABOR_VERIFIED_HRS  = 1.783; // 1h 47min
const LABOR_RATE          = 92;    // $/hr — within $80–$115 benchmark
const LABOR_RANGE         = '1h 15min – 2h 30min';

const MATERIALS: { desc: string; amount: number; benchmarkLow: number; benchmarkHigh: number }[] = [
  { desc: '40-gal natural gas water heater', amount: 487.00, benchmarkLow: 420, benchmarkHigh: 530 },
  { desc: 'Push-to-connect fittings',        amount:  28.50, benchmarkLow:  18, benchmarkHigh:  45 },
  { desc: 'Thermal expansion tank',          amount:  62.00, benchmarkLow:  50, benchmarkHigh:  85 },
];

const LABOR_SUBMITTED_COST = +(LABOR_SUBMITTED_HRS * LABOR_RATE).toFixed(2);
const LABOR_ADJUSTED_COST  = +(LABOR_VERIFIED_HRS  * LABOR_RATE).toFixed(2);
const LABOR_SAVINGS        = +(LABOR_SUBMITTED_COST - LABOR_ADJUSTED_COST).toFixed(2);
const MATERIALS_TOTAL      = +MATERIALS.reduce((s, m) => s + m.amount, 0).toFixed(2);
const INVOICE_TOTAL        = +(LABOR_ADJUSTED_COST + MATERIALS_TOTAL).toFixed(2);
const NTE                  = 850;
const UNDER_NTE            = +(NTE - INVOICE_TOTAL).toFixed(2);

function fmt(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function hrsLabel(h: number) {
  const whole = Math.floor(h);
  const min   = Math.round((h - whole) * 60);
  return min > 0 ? `${whole}h ${min}min` : `${whole}h`;
}

interface Props {
  assessment: LaborHoursAssessment;
  delay?: number;
  className?: string;
}

export function InvoiceProtectionPanel({ assessment, delay = 0.4, className }: Props) {
  const laborInBand = assessment.is_appropriate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={className ?? 'card p-4 space-y-4'}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={13} className="text-accent-ai shrink-0" />
          <span className="font-mono text-[10px] text-accent-ai uppercase tracking-widest">
            Invoice Intelligence
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px]
                     bg-[rgba(16,185,129,0.1)] border border-status-pass"
        >
          <DollarSign size={9} className="text-status-pass" />
          <span className="font-mono text-[9px] text-status-pass uppercase tracking-wider">
            Customer Protected · {fmt(LABOR_SAVINGS)} saved
          </span>
        </motion.div>
      </div>

      <div className="w-full h-px bg-border-subtle" />

      {/* ── Labor assessment ───────────────────────────────────────── */}
      <div className="space-y-2.5">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
          Labor Assessment
        </p>

        {/* Time comparison row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-2.5 bg-bg-surface2">
            <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-wide mb-0.5">
              GPS Verified
            </p>
            <p className="font-mono text-[13px] text-status-pass font-bold">
              {hrsLabel(LABOR_VERIFIED_HRS)}
            </p>
          </div>
          <div className="card p-2.5 bg-[rgba(239,68,68,0.06)] border-status-fail">
            <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-wide mb-0.5">
              Submitted
            </p>
            <p className="font-mono text-[13px] text-status-fail font-bold">
              {hrsLabel(LABOR_SUBMITTED_HRS)}
            </p>
          </div>
          <div className="card p-2.5 bg-bg-surface2">
            <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-wide mb-0.5">
              AI Predicted
            </p>
            <p className="font-mono text-[11px] text-text-secondary">
              {LABOR_RANGE}
            </p>
          </div>
        </div>

        {/* Adjustment alert */}
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="flex items-start gap-2 px-3 py-2 rounded-[4px]
                     bg-[rgba(245,158,11,0.08)] border border-status-warn"
        >
          <AlertTriangle size={11} className="text-status-warn shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-mono text-[10px] text-status-warn uppercase tracking-wide">
              Labor Hours Adjusted
            </p>
            <p className="font-sans text-[11px] text-text-secondary leading-snug">
              Provider submitted {hrsLabel(LABOR_SUBMITTED_HRS)} — exceeds AI-predicted range of {LABOR_RANGE}.
              Invoice auto-adjusted to GPS-verified on-site time.
            </p>
          </div>
        </motion.div>

        {/* Rate check */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Check size={10} className="text-status-pass" />
            <span className="font-mono text-[10px] text-text-secondary">
              Rate: {fmt(LABOR_RATE)}/hr
            </span>
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            Benchmark $80–$115/hr · within range
          </span>
        </div>

        {/* Labor cost delta */}
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-[9px] text-text-tertiary uppercase">Submitted</p>
              <p className="font-mono text-[12px] text-status-fail line-through">{fmt(LABOR_SUBMITTED_COST)}</p>
            </div>
            <span className="font-mono text-[11px] text-text-tertiary">→</span>
            <div>
              <p className="font-mono text-[9px] text-text-tertiary uppercase">Adjusted</p>
              <p className="font-mono text-[12px] text-status-pass">{fmt(LABOR_ADJUSTED_COST)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] text-text-tertiary uppercase">Saved</p>
            <p className="font-mono text-[13px] text-status-pass font-bold">{fmt(LABOR_SAVINGS)}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-border-subtle" />

      {/* ── Materials audit ────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
          Materials Audit
        </p>
        <div className="space-y-1.5">
          {MATERIALS.map((item, i) => {
            const inRange = item.amount >= item.benchmarkLow && item.amount <= item.benchmarkHigh;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.35 + i * 0.07 }}
                className="flex items-center justify-between gap-2"
              >
                <span className="font-sans text-[11px] text-text-secondary flex-1 min-w-0 truncate">
                  {item.desc}
                </span>
                <span className="font-mono text-[11px] text-text-primary shrink-0">
                  {fmt(item.amount)}
                </span>
                <div className="flex items-center gap-1 shrink-0 w-24 justify-end">
                  {inRange ? (
                    <Check size={9} className="text-status-pass" />
                  ) : (
                    <AlertTriangle size={9} className="text-status-warn" />
                  )}
                  <span className={`font-mono text-[9px] uppercase ${
                    inRange ? 'text-text-tertiary' : 'text-status-warn'
                  }`}>
                    {fmt(item.benchmarkLow)}–{fmt(item.benchmarkHigh)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <span className="font-mono text-[10px] text-text-tertiary uppercase">Materials total</span>
          <span className="font-mono text-[12px] text-text-primary">{fmt(MATERIALS_TOTAL)}</span>
        </div>
      </div>

      <div className="w-full h-px bg-border-subtle" />

      {/* ── Final invoice summary ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6 }}
        className="space-y-2"
      >
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
          Invoice Summary
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="font-mono text-[9px] text-text-tertiary uppercase mb-0.5">Adjusted Labor</p>
            <p className="font-mono text-[13px] text-text-primary">{fmt(LABOR_ADJUSTED_COST)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-text-tertiary uppercase mb-0.5">Materials</p>
            <p className="font-mono text-[13px] text-text-primary">{fmt(MATERIALS_TOTAL)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-text-tertiary uppercase mb-0.5">Total</p>
            <p className="font-mono text-[14px] text-text-primary font-bold">{fmt(INVOICE_TOTAL)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-[4px]
                        bg-[rgba(16,185,129,0.08)] border border-status-pass">
          <div className="flex items-center gap-1.5">
            <Check size={10} className="text-status-pass" />
            <span className="font-mono text-[10px] text-status-pass uppercase tracking-wide">
              Under NTE by {fmt(UNDER_NTE)}
            </span>
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            NTE {fmt(NTE)}
          </span>
        </div>

        {laborInBand ? (
          <p className="font-mono text-[10px] text-text-tertiary">
            → Invoice eligible for auto-approval. No OC review required.
          </p>
        ) : (
          <p className="font-mono text-[10px] text-status-warn">
            → Routed to OC — labor adjustment requires sign-off before billing.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
