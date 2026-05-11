/**
 * DMG AI Engine Icon — used on every AI-trigger action across all three modules.
 * Reads as "intelligence active / engine running": a hexagonal processor
 * with radiating signal lines and a pulsing core.
 */
interface Props {
  size?: number;
  className?: string;
}

export function AIEngineIcon({ size = 16, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Outer hexagon — processor shell */}
      <polygon
        points="10,1.5 17.5,5.5 17.5,14.5 10,18.5 2.5,14.5 2.5,5.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* Inner ring */}
      <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1" />
      {/* Core dot */}
      <circle cx="10" cy="10" r="1.4" fill="currentColor" />
      {/* Cardinal signal ticks */}
      <line x1="10" y1="3.4" x2="10" y2="5.8"  stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="10" y1="14.2" x2="10" y2="16.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="3.8" y1="7.2"  x2="5.8" y2="8.4"  stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="14.2" y1="11.6" x2="16.2" y2="12.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="3.8"  y1="12.8" x2="5.8"  y2="11.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="14.2" y1="8.4"  x2="16.2" y2="7.2"  stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
