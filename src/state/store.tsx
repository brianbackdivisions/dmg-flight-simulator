import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { DemoState, DemoAction, IntakeFormInput } from '@/data/types';
import { hotWaterHeaterScenario } from '@/data/scenarios';

const initialInput: IntakeFormInput = {
  property: '',
  description: '',
  service_line_input: null,
  urgency: 'routine',
  customer: '',
};

const initialState: DemoState = {
  stage: 'scenario',
  presenterMode: false,
  selectedScenario: null,
  m1Screen: 'form',
  m1Input: initialInput,
  m1Response: null,
  m1WorkActions: [],
  m2Screen: 'processing',
  m2Response: null,
  assignedProvider: null,
  m3Screen: 'photos',
  m3Response: null,
};

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SELECT_SCENARIO': {
      const scenario =
        action.payload === 'hot-water-heater'
          ? hotWaterHeaterScenario
          : action.payload === 'hvac-not-cooling'
          ? { scenario_id: 'hvac-not-cooling', input: { property: 'Walgreens – Austin, TX', description: 'AC not cooling. Store is hot. Customers complaining.', service_line_input: null, urgency: 'emergency' as const, customer: 'Walgreens' } }
          : { scenario_id: 'ceiling-tile-damage', input: { property: 'Dollar General – Memphis, TN', description: 'Several ceiling tiles damaged and sagging near the back stockroom. Possible water damage.', service_line_input: null, urgency: 'routine' as const, customer: 'Dollar General' } };
      return {
        ...state,
        selectedScenario: action.payload,
        stage: 'module1',
        m1Screen: 'form',
        m1Input: scenario.input,
      };
    }
    case 'SET_STAGE':
      return { ...state, stage: action.payload };
    case 'SET_M1_SCREEN':
      return { ...state, m1Screen: action.payload };
    case 'SET_M1_INPUT':
      return { ...state, m1Input: { ...state.m1Input, ...action.payload } };
    case 'SET_M1_RESPONSE':
      return { ...state, m1Response: action.payload };
    case 'SET_M1_WORK_ACTIONS':
      return { ...state, m1WorkActions: action.payload };
    case 'SET_M2_SCREEN':
      return { ...state, m2Screen: action.payload };
    case 'SET_M2_RESPONSE':
      return { ...state, m2Response: action.payload };
    case 'SET_ASSIGNED_PROVIDER':
      return { ...state, assignedProvider: action.payload };
    case 'SET_M3_SCREEN':
      return { ...state, m3Screen: action.payload };
    case 'SET_M3_RESPONSE':
      return { ...state, m3Response: action.payload };
    case 'SET_PRESENTER_MODE':
      return { ...state, presenterMode: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

interface StoreContextValue {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
