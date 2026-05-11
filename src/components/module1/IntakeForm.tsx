import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Zap } from 'lucide-react';
import { useStore } from '@/state/store';
import { qualify } from '@/api/client';
import type { QualifyRequest } from '@/api/types';

export function IntakeForm() {
  const { state, dispatch } = useStore();
  const { m1Input } = state;
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
    } catch (err) {
      console.error('Qualify error:', err);
      dispatch({ type: 'SET_M1_SCREEN', payload: 'form' });
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-sans text-[24px] font-500 text-text-secondary mb-1">
          Start with what your team actually sends us.
        </h1>
        <p className="font-sans text-[15px] text-text-secondary">
          This is all we need. Our AI handles the rest.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="card w-full max-w-[640px] p-6 flex flex-col gap-4"
      >
        {/* Property */}
        <Field label="Property / Location">
          <input
            type="text"
            value={m1Input.property}
            onChange={(e) => dispatch({ type: 'SET_M1_INPUT', payload: { property: e.target.value } })}
            className="form-input"
            placeholder="e.g. Heartland Dental – Bloomington, IL"
            required
          />
        </Field>

        {/* Work Description */}
        <Field label="Work Description">
          <textarea
            rows={4}
            value={m1Input.description}
            onChange={(e) => dispatch({ type: 'SET_M1_INPUT', payload: { description: e.target.value } })}
            className="form-input resize-none"
            placeholder="Describe the issue in plain language. Informal is fine."
            required
          />
        </Field>

        {/* Row: Service Line + Urgency */}
        <div className="flex gap-4">
          <Field label="Service Line" className="flex-1">
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
              <option value="">Leave blank for AI prediction</option>
              <option value="plumbing">Plumbing</option>
              <option value="hvac">HVAC</option>
              <option value="electrical">Electrical</option>
              <option value="general-maintenance">General Maintenance</option>
              <option value="roofing">Roofing</option>
            </select>
          </Field>

          <Field label="Urgency" className="flex-1">
            <div className="flex gap-3 h-[38px] items-center">
              {(['emergency', 'routine'] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() =>
                      dispatch({ type: 'SET_M1_INPUT', payload: { urgency: opt } })
                    }
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      m1Input.urgency === opt
                        ? 'border-accent-ai bg-accent-ai'
                        : 'border-border-subtle'
                    }`}
                  >
                    {m1Input.urgency === opt && (
                      <div className="w-1.5 h-1.5 rounded-full bg-bg-base" />
                    )}
                  </div>
                  <span className={`font-sans text-[13px] capitalize select-none ${opt === 'emergency' ? 'text-status-fail' : 'text-text-secondary'}`}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        {/* Customer */}
        <Field label="Customer Name">
          <input
            type="text"
            value={m1Input.customer}
            onChange={(e) => dispatch({ type: 'SET_M1_INPUT', payload: { customer: e.target.value } })}
            className="form-input"
            placeholder="Optional"
          />
        </Field>

        {/* File drop */}
        <Field label="Attach Photo(s)" hint="Optional — AI uses visual context too">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border border-dashed rounded-[6px] p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
              dragging
                ? 'border-accent-ai bg-[rgba(0,196,232,0.06)]'
                : 'border-border-subtle hover:border-text-tertiary'
            }`}
          >
            <Upload size={18} className="text-text-tertiary" />
            <span className="font-sans text-[13px] text-text-tertiary">
              Drop photos here or click to browse
            </span>
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
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded bg-bg-surface2 border border-border-subtle">
                  <span className="font-mono text-[11px] text-text-secondary">{f.name}</span>
                  <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                    <X size={10} className="text-text-tertiary hover:text-status-fail" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-[6px] bg-accent-action text-white font-sans text-[16px] font-500
                     hover:bg-[#d4561e] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Zap size={16} />
          Run AI Analysis →
        </button>
      </motion.form>

      <style>{`
        .form-input {
          width: 100%;
          padding: 8px 12px;
          background: #0F1D35;
          border: 1px solid #1A2D45;
          border-radius: 6px;
          color: #EEF2F7;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus {
          border-color: #00C4E8;
        }
        .form-input option {
          background: #0F1D35;
          color: #EEF2F7;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        <label className="font-sans text-[13px] font-500 text-text-secondary">{label}</label>
        {hint && <span className="font-sans text-[11px] text-text-tertiary">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
