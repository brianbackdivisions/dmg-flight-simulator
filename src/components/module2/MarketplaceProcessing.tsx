import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useStore } from '@/state/store';
import { getScenario } from '@/data/scenarios';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// ─── Provider city dots ───────────────────────────────────────────────────────

const CITY_DOTS: { id: number; coords: [number, number] }[] = [
  { id: 0,  coords: [-122.4, 47.6] },  // Seattle
  { id: 1,  coords: [-122.7, 45.5] },  // Portland
  { id: 2,  coords: [-122.5, 37.7] },  // San Francisco
  { id: 3,  coords: [-118.2, 34.1] },  // Los Angeles
  { id: 4,  coords: [-112.1, 33.5] },  // Phoenix
  { id: 5,  coords: [-104.9, 39.7] },  // Denver
  { id: 6,  coords: [-111.9, 40.8] },  // Salt Lake City
  { id: 7,  coords: [-108.5, 45.8] },  // Billings
  { id: 8,  coords: [-93.3,  44.9] },  // Minneapolis
  { id: 9,  coords: [-87.9,  43.0] },  // Milwaukee
  { id: 10, coords: [-87.6,  41.9] },  // Chicago
  { id: 11, coords: [-83.0,  42.3] },  // Detroit
  { id: 12, coords: [-81.7,  41.5] },  // Cleveland
  { id: 13, coords: [-75.2,  39.9] },  // Philadelphia
  { id: 14, coords: [-74.0,  40.7] },  // New York
  { id: 15, coords: [-71.1,  42.3] },  // Boston
  { id: 16, coords: [-86.2,  39.8] },  // Indianapolis
  { id: 17, coords: [-86.8,  36.2] },  // Nashville
  { id: 18, coords: [-94.6,  39.1] },  // Kansas City
  { id: 19, coords: [-96.8,  32.8] },  // Dallas
  { id: 20, coords: [-95.4,  29.8] },  // Houston
  { id: 21, coords: [-90.1,  29.9] },  // New Orleans
  { id: 22, coords: [-84.4,  33.7] },  // Atlanta
  { id: 23, coords: [-80.8,  35.2] },  // Charlotte
  { id: 24, coords: [-90.2,  38.6] },  // St. Louis
];

// ─── Tier pipeline ────────────────────────────────────────────────────────────

const TIERS = [
  { label: 'Priority & Preferred Providers', count: 12 },
  { label: 'Top Model-Matched Providers', count: 18 },
  { label: 'Property Veterans', count: 4 },
  { label: 'High-Capacity Available', count: 9 },
  { label: 'Remaining Matched Providers', count: 8 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function distSq(a: [number, number], b: [number, number]) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

export function MarketplaceProcessing() {
  const { state } = useStore();
  const [visibleIds, setVisibleIds]   = useState<number[]>([]);
  const [activeTiers, setActiveTiers] = useState<number[]>([]);
  const [rankingText, setRankingText] = useState(false);
  const startedRef = useRef(false);

  const scenario = state.selectedScenario ? getScenario(state.selectedScenario) : null;
  const mapCenter: [number, number] =
    scenario && 'map_center' in scenario
      ? (scenario.map_center as [number, number])
      : [-88.9, 40.5];

  // Top 3 nearest to job
  const sorted = [...CITY_DOTS].sort((a, b) => distSq(a.coords, mapCenter) - distSq(b.coords, mapCenter));
  const top3 = new Set(sorted.slice(0, 3).map(d => d.id));

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Dots scatter-appear
    CITY_DOTS.forEach((_, i) => {
      setTimeout(() => setVisibleIds(prev => [...prev, i]), 250 + i * 110);
    });

    // Tier pipeline
    TIERS.forEach((_, i) => {
      setTimeout(() => setActiveTiers(prev => [...prev, i]), 2000 + i * 750);
    });

    // Ranking label
    setTimeout(() => setRankingText(true), 2000 + TIERS.length * 750 + 300);
  }, []);

  const locationLabel =
    scenario && 'input' in scenario
      ? (scenario as { input: { property: string } }).input.property
      : 'Job Location';

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* ── Map ──────────────────────────────────────────────────────── */}
      <div className="relative bg-[#050e1c] overflow-hidden flex-shrink-0" style={{ height: '340px' }}>
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_55%_50%,rgba(0,196,232,0.06),transparent)]" />

        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          {/* State fills */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: '#0c1a2e',
                      stroke: 'rgba(0,196,232,0.22)',
                      strokeWidth: 0.6,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#0c1a2e',
                      stroke: 'rgba(0,196,232,0.22)',
                      strokeWidth: 0.6,
                      outline: 'none',
                    },
                    pressed: { fill: '#0c1a2e', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Provider dots */}
          {CITY_DOTS.map((dot, i) => {
            const isVisible = visibleIds.includes(dot.id);
            const isTop = top3.has(dot.id);
            return (
              <Marker key={dot.id} coordinates={dot.coords}>
                <motion.circle
                  r={isTop ? 5 : 3.5}
                  fill={isTop ? '#E8672B' : '#00C4E8'}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    !isVisible
                      ? { opacity: 0, scale: 0 }
                      : { opacity: isTop ? 1 : 0.55, scale: 1 }
                  }
                  transition={{ duration: 0.35, delay: i * 0.02 }}
                />
                {/* Pulse ring on top 3 */}
                {isVisible && isTop && (
                  <motion.circle
                    r={5}
                    fill="none"
                    stroke="#E8672B"
                    strokeWidth={1.5}
                    animate={{ r: [5, 14], opacity: [0.8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </Marker>
            );
          })}

          {/* Job pin */}
          <Marker coordinates={mapCenter}>
            <motion.circle
              r={0}
              fill="#E8672B"
              stroke="rgba(232,103,43,0.5)"
              strokeWidth={6}
              animate={{ r: 7 }}
              transition={{ delay: 0.4, duration: 0.4, ease: 'backOut' }}
            />
            <motion.circle
              r={7}
              fill="none"
              stroke="#E8672B"
              strokeWidth={2}
              animate={{ r: [7, 22], opacity: [0.9, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </Marker>
        </ComposableMap>

        {/* Top-left overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-ai animate-pulse" />
          <span className="font-mono text-[10px] text-accent-ai uppercase tracking-wider truncate max-w-[360px]">
            {locationLabel} · Provider Coverage
          </span>
        </div>

        {/* Bottom-center status */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <AnimatePresence mode="wait">
            {rankingText ? (
              <motion.span key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-mono text-[11px] text-accent-ai uppercase tracking-widest">
                Generating AI recommendations...
              </motion.span>
            ) : (
              <motion.span key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-mono text-[11px] text-text-tertiary uppercase tracking-widest animate-pulse">
                Scanning provider network...
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Qualified badge */}
        <AnimatePresence>
          {activeTiers.length >= TIERS.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5
                         rounded-[4px] bg-[rgba(0,196,232,0.1)] border border-accent-ai"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-status-pass" />
              <span className="font-mono text-[11px] text-accent-ai uppercase tracking-wider">
                40 providers qualified
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tier pipeline ────────────────────────────────────────────── */}
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
              <span className={`font-mono text-[12px] flex-1 transition-colors duration-300 ${done ? 'text-text-primary' : 'text-text-tertiary'}`}>
                {tier.label}
              </span>
              <AnimatePresence>
                {done && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2">
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
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-mono text-[11px] text-accent-ai">
                Ranking by AI match score...
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
