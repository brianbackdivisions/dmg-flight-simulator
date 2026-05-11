import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label = 'Overall',
  color = '#00C4E8',
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1A2D45"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <text
          x={center}
          y={center + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#EEF2F7"
          fontSize={size >= 100 ? 28 : 18}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="500"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${center}px ${center}px` }}
        >
          {score}
        </text>
      </svg>
      <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
