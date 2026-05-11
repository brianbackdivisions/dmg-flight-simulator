import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X } from 'lucide-react';
import { useStore } from '@/state/store';
import { startVerify, pollVerify } from '@/api/client';
import { AIEngineIcon } from '@/components/shared/AIEngineIcon';

const PHOTO_TABS = [
  { id: 'before', label: 'Before', count: 3 },
  { id: 'during', label: 'During', count: 3 },
  { id: 'after', label: 'After', count: 3 },
];

const MOCK_TIMESTAMPS = [
  '08:14:22', '08:15:41', '08:16:03',
  '09:02:17', '09:14:55', '09:28:11',
  '10:12:09', '10:14:33', '10:15:01',
];

const TASK_REFS = ['Task 1', 'Task 2', 'Task 3', 'Task 3', undefined, undefined, 'Task 3', 'Task 4', undefined];

interface PhotoCardProps {
  index: number;
  tab: string;
  tabIndex: number;
  verified: boolean;
  taskRef?: string;
}

function PhotoCard({ index, tab, tabIndex, verified, taskRef }: PhotoCardProps) {
  const ts = MOCK_TIMESTAMPS[tabIndex * 3 + index] ?? '09:00:00';
  return (
    <div className="relative rounded-[6px] overflow-hidden bg-bg-surface2 border border-border-subtle aspect-[4/3]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Camera size={24} className="text-text-tertiary" />
        <span className="font-mono text-[10px] text-text-tertiary uppercase">
          {tab} Photo {index + 1}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 flex items-end justify-between">
        <span className="font-mono text-[10px] text-text-tertiary">{ts}</span>
        <span className="font-mono text-[10px] text-text-tertiary">Bloomington, IL</span>
      </div>

      {verified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 flex flex-col items-end gap-1"
        >
          <span className="font-mono text-[9px] bg-[rgba(0,196,232,0.15)] border border-accent-ai text-accent-ai px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide">
            AI Reviewed
          </span>
          {taskRef && (
            <span className="font-mono text-[9px] bg-bg-surface1/80 text-text-tertiary px-1.5 py-0.5 rounded-[3px]">
              {taskRef}
            </span>
          )}
        </motion.div>
      )}

      {verified && (
        <div className="absolute inset-0 border-2 border-status-pass rounded-[6px] pointer-events-none" />
      )}
    </div>
  );
}

function UploadZone({ tabLabel }: { tabLabel: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
        }}
        onClick={() => fileRef.current?.click()}
        className="border border-dashed border-border-subtle rounded-[6px] px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-accent-ai hover:bg-[rgba(0,196,232,0.04)] transition-all group"
      >
        <Upload size={14} className="text-text-tertiary group-hover:text-accent-ai transition-colors shrink-0" />
        <div>
          <p className="font-sans text-[12px] text-text-secondary group-hover:text-text-primary transition-colors">
            Add {tabLabel.toLowerCase()} photos
          </p>
          <p className="font-mono text-[10px] text-text-tertiary">Drop files or click to browse</p>
        </div>
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
        <div className="flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-bg-surface2 border border-border-subtle">
              <span className="font-mono text-[10px] text-text-secondary">{f.name}</span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
              >
                <X size={9} className="text-text-tertiary hover:text-status-fail" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PhotoGallery() {
  const { state, dispatch } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { m3Response } = state;

  async function handleRunVerification() {
    setLoading(true);
    dispatch({ type: 'SET_M3_SCREEN', payload: 'processing' });

    try {
      const { report_id } = await startVerify({
        work_id: 'DEMO_WV_PLUMBING_WATER_HEATER_01',
      });
      const report = await pollVerify(report_id);
      dispatch({ type: 'SET_M3_RESPONSE', payload: report });
      // Stay on 'processing' — VerificationProcessing handles results in-place
    } catch (err) {
      console.error('Verify error:', err);
      dispatch({ type: 'SET_M3_SCREEN', payload: 'photos' });
      setLoading(false);
    }
  }

  const tabData = PHOTO_TABS[activeTab];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
      {/* Phase timeline */}
      <PhaseTimeline />

      {/* Header */}
      <div>
        <h2 className="font-sans text-[20px] font-500 text-text-primary mb-1">
          The provider has checked out. Here's what they submitted.
        </h2>
        <p className="font-sans text-[14px] text-text-secondary">
          9 photos across 3 visit windows: before, during, and after.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1">
        {PHOTO_TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-[6px] font-mono text-[12px] uppercase tracking-wider transition-all ${
              activeTab === i
                ? 'bg-bg-surface2 border border-accent-ai text-accent-ai'
                : 'bg-bg-surface1 border border-border-subtle text-text-tertiary hover:border-text-tertiary'
            }`}
          >
            {tab.label} · {tab.count}/3{m3Response ? ' ✅' : ''}
          </button>
        ))}
      </div>

      {/* Upload zone for this tab */}
      {!m3Response && <UploadZone tabLabel={tabData.label} />}

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <PhotoCard
            key={i}
            index={i}
            tab={tabData.id}
            tabIndex={activeTab}
            verified={!!m3Response}
            taskRef={TASK_REFS[activeTab * 3 + i]}
          />
        ))}
      </div>

      {/* CTA */}
      {!m3Response && (
        <motion.button
          onClick={handleRunVerification}
          disabled={loading}
          className="w-full py-3 rounded-[6px] bg-accent-action text-white font-mono text-[13px] font-bold
                     tracking-[0.1em] uppercase hover:bg-[#d4561e] transition-colors flex items-center
                     justify-center gap-2 disabled:opacity-60"
        >
          <AIEngineIcon size={14} />
          AI Quality Verification →
        </motion.button>
      )}
    </div>
  );
}

function PhaseTimeline() {
  return (
    <div className="flex items-center gap-3">
      {[
        { label: 'Phase 1: Actions Created', sub: 'at intake', done: true },
        { label: 'Phase 2: Photos Analyzed', sub: 'on upload', done: true },
        { label: 'Phase 3: Verdict', sub: 'at checkout', active: true },
      ].map((phase, i) => (
        <div key={i} className="flex items-center gap-3">
          {i > 0 && <div className="w-8 h-px bg-border-subtle" />}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                phase.done
                  ? 'bg-status-pass'
                  : phase.active
                  ? 'bg-accent-ai animate-pulse'
                  : 'bg-text-tertiary'
              }`}
            />
            <div>
              <p className="font-mono text-[11px] text-text-secondary">{phase.label}</p>
              <p className="font-mono text-[10px] text-text-tertiary">{phase.sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
