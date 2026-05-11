import { Presentation, RefreshCw } from 'lucide-react';
import { useStore } from '@/state/store';
import { StageRail } from './StageRail';
import { JobBriefBanner } from './JobBriefBanner';

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
          {/* DMG wordmark + FLIGHT SIMULATOR designation */}
          <div className="flex items-center gap-4 shrink-0">
            {/* DMG wordmark SVG */}
            <div className="shrink-0">
              <svg width="64" height="36" viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text
                  x="2" y="28"
                  fontFamily="'Arial Black', 'Arial', sans-serif"
                  fontWeight="900"
                  fontSize="28"
                  letterSpacing="1"
                  fill="white"
                >DMG</text>
                <rect x="2" y="32" width="28" height="3" rx="1.5" fill="#E8672B" />
              </svg>
            </div>
            <div className="flex flex-col gap-[5px]">
              <span className="font-mono text-[18px] font-bold tracking-[0.18em] text-text-primary uppercase leading-none">
                Flight Simulator
              </span>
              <div className="h-[2px] rounded-full bg-accent-action opacity-80" />
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
