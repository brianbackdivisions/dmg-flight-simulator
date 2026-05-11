import { cn } from '@/lib/utils';

type BadgeVariant = 'ai' | 'pass' | 'warn' | 'fail' | 'slate' | 'action';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  ai:     'bg-[rgba(0,196,232,0.1)] border border-accent-ai text-accent-ai',
  pass:   'bg-[rgba(16,185,129,0.1)] border border-status-pass text-status-pass',
  warn:   'bg-[rgba(245,158,11,0.1)] border border-status-warn text-status-warn',
  fail:   'bg-[rgba(239,68,68,0.12)] border border-status-fail text-status-fail',
  slate:  'bg-[rgba(61,85,112,0.2)] border border-text-tertiary text-text-secondary',
  action: 'bg-[rgba(242,101,34,0.12)] border border-accent-action text-accent-action',
};

export function StatusBadge({ children, variant = 'slate', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[3px] px-[6px] py-[2px]',
        'font-mono text-[11px] tracking-[0.08em] uppercase leading-none',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
