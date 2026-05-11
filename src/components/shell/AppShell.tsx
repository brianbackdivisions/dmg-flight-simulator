import { Presentation, RefreshCw } from 'lucide-react';
import { useStore } from '@/state/store';
import { StageRail } from './StageRail';
import { JobBriefBanner } from './JobBriefBanner';
import dmgLogo from '@/assets/hero.png';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { state, dispatch } = useStore();
  const showBanner = state.stage === 'module2' || state.stage === 'module3';

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Top nav rail */}
      {!state.presenterMode && (
        <header className="h-16 border-b border-border-subtle bg-bg-surface1 flex items-center px-6 gap-6 shrink-0">
          {/* DMG logo + FLIGHT SIMULATOR designation */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={dmgLogo} alt="DMG" className="h-9 w-auto" />
            <div className="flex flex-col gap-[4px] pl-3 border-l border-border-subtle">
              <span className="font-mono text-[11px] font-bold tracking-[0.28em] text-text-primary uppercase leading-none">
                Flight Simulator
              </span>
              <div className="h-[2px] rounded-full bg-accent-action opacity-75" />
            </div>
          </div>

          {/* Stage rail — centered */}
          {state.stage !== 'scenario' && (
            <div className="flex-1 flex justify-center">
              <StageRail />
            </div>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {state.stage !== 'scenario' && (
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-surface2 border border-border-subtle text-text-tertiary hover:text-text-secondary transition-colors font-sans text-[12px]"
              >
                <RefreshCw size={12} />
                Reset
              </button>
            )}
            <button
              onClick={() => dispatch({ type: 'SET_PRESENTER_MODE', payload: !state.presenterMode })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-sans text-[12px] transition-colors ${
                state.presenterMode
                  ? 'bg-accent-ai text-bg-base border-accent-ai'
                  : 'bg-bg-surface2 border-border-subtle text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Presentation size={12} />
              Presenter
            </button>
          </div>
        </header>
      )}

      {/* Presenter mode minimal bar */}
      {state.presenterMode && (
        <div className="h-8 border-b border-border-subtle bg-bg-base flex items-center px-4 justify-between shrink-0">
          <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">DMG Flight Simulator</span>
          <button
            onClick={() => dispatch({ type: 'SET_PRESENTER_MODE', payload: false })}
            className="font-mono text-[10px] text-text-tertiary hover:text-accent-ai transition-colors uppercase tracking-wider"
          >
            Exit Presenter Mode
          </button>
        </div>
      )}

      {/* Job brief banner */}
      {showBanner && <JobBriefBanner />}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
