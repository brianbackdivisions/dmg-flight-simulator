import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { StoreProvider, useStore } from '@/state/store';
import { AppShell } from '@/components/shell/AppShell';
import { ScenarioSelector } from '@/components/module1/ScenarioSelector';
import { Module1Screen } from '@/components/module1/Module1Screen';
import { MarketplaceProcessing } from '@/components/module2/MarketplaceProcessing';
import { ProviderRecommendations } from '@/components/module2/ProviderRecommendations';
import { CSAAssignedScreen } from '@/components/module2/CSAAssignedScreen';
import { PhotoGallery } from '@/components/module3/PhotoGallery';
import { VerificationProcessing } from '@/components/module3/VerificationProcessing';
import { VerdictReport } from '@/components/module3/VerdictReport';
import { SummaryScreen } from '@/components/summary/SummaryScreen';

function AppContent() {
  const { state } = useStore();
  const { stage, m2Screen, m3Screen } = state;

  function renderContent() {
    if (stage === 'scenario') return <ScenarioSelector />;

    if (stage === 'module1') return <Module1Screen />;

    if (stage === 'module2') {
      if (m2Screen === 'processing') return <MarketplaceProcessing />;
      if (m2Screen === 'results') return <ProviderRecommendations />;
      if (m2Screen === 'csa-assigned') return <CSAAssignedScreen />;
    }

    if (stage === 'module3') {
      if (m3Screen === 'photos') return <PhotoGallery />;
      if (m3Screen === 'processing') return <VerificationProcessing />;
      if (m3Screen === 'report') return <VerdictReport />;
    }

    if (stage === 'summary') return <SummaryScreen />;

    return null;
  }

  const pageHidden = document.visibilityState === 'hidden';

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${stage}-${stage === 'module1' ? 'persistent' : `${m2Screen}-${m3Screen}`}`}
          initial={pageHidden ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={pageHidden ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

export default function App() {
  useEffect(() => {
    function syncClass() {
      document.body.classList.toggle('page-hidden', document.visibilityState === 'hidden');
    }
    syncClass();
    document.addEventListener('visibilitychange', syncClass);
    return () => document.removeEventListener('visibilitychange', syncClass);
  }, []);

  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
