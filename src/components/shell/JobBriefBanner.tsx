import { useStore } from '@/state/store';

export function JobBriefBanner() {
  const { state } = useStore();
  const { m1Response, m1Input, assignedProvider, stage } = state;

  if (!m1Response) return null;

  return (
    <div className="border-b border-border-subtle bg-bg-surface2 px-6 py-2 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
      <span className="font-mono text-[12px] text-text-tertiary uppercase tracking-wider">
        JOB BRIEF
      </span>
      <span className="text-text-tertiary font-mono text-[12px]">·</span>
      <span className="font-mono text-[12px] text-text-secondary">
        {m1Response.work_scope.split('.')[0].slice(0, 40)}
      </span>
      <span className="text-text-tertiary font-mono text-[12px]">·</span>
      <span className="font-mono text-[12px] text-text-secondary">{m1Input.property}</span>
      {m1Response.work_scope && (
        <>
          <span className="text-text-tertiary font-mono text-[12px]">·</span>
          <span className="font-mono text-[12px] text-text-secondary">
            NTE: $350–$500
          </span>
        </>
      )}
      {assignedProvider && stage === 'module3' && (
        <>
          <span className="text-text-tertiary font-mono text-[12px]">·</span>
          <span className="font-mono text-[12px] text-text-secondary">
            Provider: {assignedProvider.provider_name}
          </span>
        </>
      )}
    </div>
  );
}
