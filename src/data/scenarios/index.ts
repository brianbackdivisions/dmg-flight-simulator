import { hotWaterHeaterScenario } from './hot-water-heater';
import { hvacScenario } from './hvac-not-cooling';
import { ceilingTileScenario } from './ceiling-tile-damage';
import { landscapingScenario } from './landscaping';
import { snowRemovalScenario } from './snow-removal';

export type Scenario = (
  | typeof hotWaterHeaterScenario
  | typeof hvacScenario
  | typeof ceilingTileScenario
  | typeof landscapingScenario
  | typeof snowRemovalScenario
) & { is_csa?: boolean };

export const SCENARIOS: Scenario[] = [
  hotWaterHeaterScenario,
  hvacScenario,
  ceilingTileScenario,
  landscapingScenario,
  snowRemovalScenario,
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.scenario_id === id);
}

export { hotWaterHeaterScenario, hvacScenario, ceilingTileScenario, landscapingScenario, snowRemovalScenario };
