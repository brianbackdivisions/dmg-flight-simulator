import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '@/state/store';
import { getScenario } from '@/data/scenarios';

// ─── US Map path (continental US silhouette, viewBox 0 0 800 480) ─────────────
const US_PATH = `
  M 93,52
  L 296,47 L 396,47
  L 427,80 L 511,83 L 572,76
  L 650,104 L 706,107
  L 670,150 L 628,166 L 614,176 L 594,192
  L 611,245 L 562,279 L 545,309
  L 549,331 L 558,378 L 553,398
  L 541,375 L 533,355 L 506,313
  L 451,321 L 405,318
  L 369,351 L 340,322 L 296,293 L 269,293
  L 219,301 L 177,301 L 152,283
  L 140,265 L 92,209 L 73,162
  L 70,107 L 70,71
  Z
`;

function geoToSvg(lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon + 124.5) / 57.5 * 635 + 70,
    y: (49 - lat) / 24.5 * 351 + 47,
  };
}

const CITY_DOTS = [
  { id: 0, name: 'Seattle', lon: -122.4, lat: 47.6 },
  { id: 1, name: 'Portland', lon: -122.7, lat: 45.5 },
  { id: 2, name: 'San Francisco', lon: -122.5, lat: 37.7 },
  { id: 3, name: 'Los Angeles', lon: -118.2, lat: 34.1 },
  { id: 4, name: 'Phoenix', lon: -112.1, lat: 33.5 },
  { id: 5, name: 'Denver', lon: -104.9, lat: 39.7 },
  { id: 6, name: 'Salt Lake City', lon: -111.9, lat: 40.8 },
  { id: 7, name: 'Billings', lon: -108.5, lat: 45.8 },
  { id: 8, name: 'Minneapolis', lon: -93.3, lat: 44.9 },
  { id: 9, name: 'Milwaukee', lon: -87.9, lat: 43.0 },
  { id: 10, name: 'Chicago', lon: -87.6, lat: 41.9 },
  { id: 11, name: 'Detroit', lon: -83.0, lat: 42.3 },
  { id: 12, name: 'Cleveland', lon: -81.7, lat: 41.5 },
  { id: 13, name: 'Philadelphia', lon: -75.2, lat: 39.9 },
  { id: 14, name: 'New York', lon: -74.0, lat: 40.7 },
  { id: 15, name: 'Boston', lon: -71.1, lat: 42.3 },
  { id: 16, name: 'Indianapolis', lon: -86.2, lat: 39.8 },
  { id: 17, name: 'Nashville', lon: -86.8, lat: 36.2 },
  { id: 18, name: 'Kansas City', lon: -94.6, lat: 39.1 },
  { id: 19, name: 'Dallas', lon: -96.8, lat: 32.8 },
  { id: 20, name: 'Houston', lon: -95.4, lat: 29.8 },
  { id: 21, name: 'New Orleans', lon: -90.1, lat: 29.9 },
  { id: 22, name: 'Atlanta', lon: -84.4, lat: 33.7 },
  { id: 23, name: 'Charlotte', lon: -80.8, lat: 35.2 },
  { id: 24, name: 'St. Louis', lon: -90.2, lat: 38.6 },
];

const TIERS = [
  { label: 'Priority & Preferred Providers', count: 12 },
  { label: 'Top Model-Matched Providers', count: 18 },
  { label: 'Property Veterans', count: 4 },
  { label: 'High-Capacity Available', count: 9 },
  { label: 'Remaining Matched Providers', count: 8 },
];

export function MarketplaceProcessing() {
  const { state } = useStore();
  const [visibleDotIds, setVisibleDotIds] = useState<number[]>([]);
  const [converging, setConverging] = useState(false);
  const [activeTiers, setActiveTiers] = useState<number[]>([]);
  const [rankingText, setRankingText] = useState(false);
  const startedRef = useRef(false);

  const scenario = state.selectedScenario ? getScenario(state.selectedScenario) : null;
  const mapCenter: [number, number] =
    scenario && 'map_center' in scenario
      ? (scenario.map_center as [number, number])
      : [-88.9, 40.5];

  const jobPin = geoToSvg(mapCenter[0], mapCenter[1]);

  const dotsWithPos = CITY_DOTS.map((city) => ({
    ...city,
    pos: geoToSvg(city.lon, city.lat),
    distToJob: Math.sqrt(
      Math.pow(geoToSvg(city.lon, city.lat).x - jobPin.x, 2) +
        Math.pow(geoToSvg(city.lon, city.lat).y - jobPin.y, 2),
    ),
  })).sort((a, b) => a.id - b.id);

  // Top 3 nearest to job
  const sortedByDist = [...dotsWithPos].sort((a, b) => a.distToJob - b.distToJob);
  const top3Ids = new Set(sortedByDist.slice(0, 3).map((d) => d.id));

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Phase 1: dots scatter-appear (300ms–2800ms)
    dotsWithPos.forEach((_, i) => {
      setTimeout(() => setVisibleDotIds((prev) => [...prev, i]), 300 + i * 100);
    });

    // Phase 2: tier pipeline (2200ms–5700ms)
    TIERS.forEach((_, i) => {
      setTimeout(() => setActiveTiers((prev) => [...prev, i]), 2200 + i * 700);
    });

    // Phase 3: convergence at 5900ms
    setTimeout(() => setConverging(true), 5900);

    // Show ranking text at 6200ms
    setTimeout(() => setRankingText(true), 6200);
  }, []);

  const locationLabel =
    scenario && 'input' in scenario
      ? (scenario as { input: { property: string } }).input.property
      : 'Job Location';

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* ── Map ────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#050e1c] overflow-hidden flex-shrink-0" style={{ height: '340px' }}>
        <svg
          viewBox="0 0 800 480"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full absolute inset-0"
        >
          {/* Grid */}
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,45,69,0.5)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="mapglow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,196,232,0.06)" />
              <stop offset="100%" stopColor="rgba(0,196,232,0)" />
            </radialGradient>
          </defs>
          <rect width="800" height="480" fill="url(#mapgrid)" />
          <ellipse cx="400" cy="240" rx="350" ry="250" fill="url(#mapglow)" />

          {/* US silhouette */}
          <path
            d={US_PATH}
            fill="rgba(0,196,232,0.05)"
            stroke="rgba(0,196,232,0.22)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Provider dots */}
          {dotsWithPos.map((dot, i) => {
            const isVisible = visibleDotIds.includes(dot.id);
            const isTop = top3Ids.has(dot.id);
            return (
              <motion.circle
                key={dot.id}
                r={isTop ? 4 : 3}
                fill={isTop ? '#E8672B' : '#00C4E8'}
                initial={{ cx: dot.pos.x, cy: dot.pos.y, opacity: 0 }}
                animate={
                  !isVisible
                    ? { cx: dot.pos.x, cy: dot.pos.y, opacity: 0 }
                    : converging
                    ? { cx: jobPin.x, cy: jobPin.y, opacity: 0 }
                    : { cx: dot.pos.x, cy: dot.pos.y, opacity: isTop ? 1 : 0.55 }
                }
                transition={{
                  duration: converging ? 1.4 : 0.4,
                  delay: converging ? i * 0.045 : 0,
                  ease: 'easeInOut',
                }}
              />
            );
          })}

          {/* Ping ring on job pin */}
          <motion.circle
            cx={jobPin.x}
            cy={jobPin.y}
            r={6}
            fill="none"
            stroke="#E8672B"
            strokeWidth="1.5"
            animate={{ r: [6, 22], opacity: [0.9, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* Job pin dot */}
          <motion.circle
            cx={jobPin.x}
            cy={jobPin.y}
            r={0}
            fill="#E8672B"
            animate={{ r: 6 }}
            transition={{ delay: 0.4, duration: 0.4, ease: 'backOut' }}
          />

          {/* Label near job pin */}
          <motion.text
            x={jobPin.x + 12}
            y={jobPin.y + 4}
            fill="#00C4E8"
            fontSize="10"
            fontFamily="'JetBrains Mono', monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            JOB SITE
          </motion.text>
        </svg>

        {/* Top-left overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
          <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider truncate max-w-[340px]">
            {locationLabel} · Provider Coverage
          </span>
        </div>

        {/* Bottom center status */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            {rankingText ? (
              <motion.span
                key="ranking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[11px] text-accent-ai uppercase tracking-widest"
              >
                Generating AI recommendations...
              </motion.span>
            ) : (
              <motion.span
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[11px] text-text-tertiary uppercase tracking-widest animate-pulse"
              >
                Scanning provider network...
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Provider count badge */}
        <AnimatePresence>
          {activeTiers.length >= TIERS.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[rgba(0,196,232,0.1)] border border-accent-ai"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-status-pass" />
              <span className="font-mono text-[11px] text-accent-ai uppercase tracking-wider">
                40 providers qualified
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tier pipeline ──────────────────────────────────────────────── */}
      <div className="px-8 py-5 space-y-2.5 border-t border-border-subtle bg-bg-base">
        {TIERS.map((tier, i) => {
          const done = activeTiers.includes(i);
          return (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <span className="font-mono text-[11px] text-text-tertiary w-10 shrink-0">T{i + 1}</span>
              <span
                className={`font-mono text-[12px] flex-1 transition-colors duration-300 ${
                  done ? 'text-text-primary' : 'text-text-tertiary'
                }`}
              >
                {tier.label}
              </span>
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="font-mono text-[11px] text-accent-ai">[{tier.count}]</span>
                    <Check size={11} className="text-status-pass" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <div className="border-t border-border-subtle pt-3 flex items-center justify-between">
          <span className="font-mono text-[11px] text-text-tertiary">
            51 providers evaluated · 40 qualified
          </span>
          <AnimatePresence>
            {activeTiers.length >= TIERS.length && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[11px] text-accent-ai"
              >
                Ranking by AI match score...
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
