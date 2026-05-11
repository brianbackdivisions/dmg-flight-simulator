import { hotWaterHeaterScenario } from './hot-water-heater';
import { hvacScenario } from './hvac-not-cooling';
import { ceilingTileScenario } from './ceiling-tile-damage';

export type Scenario =
  | typeof hotWaterHeaterScenario
  | typeof hvacScenario
  | typeof ceilingTileScenario;

export const SCENARIOS: Scenario[] = [hotWaterHeaterScenario, hvacScenario, ceilingTileScenario];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.scenario_id === id);
}

export { hotWaterHeaterScenario, hvacScenario, ceilingTileScenario };
