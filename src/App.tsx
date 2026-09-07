import React, { useState, useEffect, useCallback } from 'react';
import { HomeView } from './components/HomeView';
import { ScannerView } from './components/ScannerView';
import { ProblemView } from './components/ProblemView';
import { FeedbackView } from './components/FeedbackView';
import { CatalogView } from './components/CatalogView';
import { CardNotFoundView } from './components/CardNotFoundView';
import { SpectralClouds } from './components/SpectralClouds';
import { Card, AnswerOption, GameStats } from './types/card';
import {
  getCardById,
  getStoredStats,
  recordAnswer,
  resetStoredStats,
  parseQrPayload,
} from './utils/cardService';

type ScreenState = 'home' | 'scanner' | 'problem' | 'feedback' | 'catalog' | 'not-found';

// Screens that show the animated background. Card screens (problem/feedback)
// use their own grade-themed dark headers and don't need the ambient background.
const AMBIENT_BG_SCREENS: ScreenState[] = ['home', 'scanner', 'catalog', 'not-found'];

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [stats, setStats] = useState<GameStats>({ correct: 0, incorrect: 0 });
  const [lastScannedCode, setLastScannedCode] = useState<string>('');

  // Helper to open a specific card page
  const openCardPage = useCallback((cardIdOrPayload: string) => {
    const parsedId = parseQrPayload(cardIdOrPayload);
    setLastScannedCode(cardIdOrPayload);
    const card = getCardById(parsedId);
    if (card) {
      setActiveCard(card);
      setSelectedAnswer(null);
      setCurrentScreen('problem');
      const newUrl = `${window.location.pathname}?card=${card.qrId}`;
      window.history.pushState({ cardId: card.qrId }, '', newUrl);
    } else {
      setActiveCard(null);
      setCurrentScreen('not-found');
    }
  }, []);

  // Check URL on start or back button
  useEffect(() => {
    setStats(getStoredStats());

    const checkUrlRoute = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const cardParam = urlParams.get('card');
      if (cardParam) {
        openCardPage(cardParam);
        return;
      }

      const hash = window.location.hash;
      if (hash.includes('/card/')) {
        const id = hash.split('/card/')[1];
        if (id) {
          openCardPage(id);
          return;
        }
      }
    };

    checkUrlRoute();
    window.addEventListener('popstate', checkUrlRoute);
    return () => window.removeEventListener('popstate', checkUrlRoute);
  }, [openCardPage]);

  const handleScanSuccess = (rawPayload: string) => openCardPage(rawPayload);

  const handleSelectCardFromCatalog = (card: Card) => {
    setActiveCard(card);
    setSelectedAnswer(null);
    setCurrentScreen('problem');
    const newUrl = `${window.location.pathname}?card=${card.qrId}`;
    window.history.pushState({ cardId: card.qrId }, '', newUrl);
  };

  const handleSelectAnswer = (option: AnswerOption) => {
    setSelectedAnswer(option);
    const updatedStats = recordAnswer(option.isCorrect);
    setStats(updatedStats);
    setCurrentScreen('feedback');
  };

  const handleGoHome = () => {
    setActiveCard(null);
    setSelectedAnswer(null);
    setCurrentScreen('home');
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleResetStats = () => {
    const freshStats = resetStoredStats();
    setStats(freshStats);
  };

  const showAmbientBg = AMBIENT_BG_SCREENS.includes(currentScreen);

  return (
    /*
     * App shell: full viewport, grade-cycling animated background.
     * The SpectralClouds layer is rendered here (persistent across non-card screens)
     * rather than inside individual views — this avoids unmount/remount flicker
     * when navigating between Home, Scanner, Catalog, and CardNotFound.
     *
     * Card screens (problem/feedback) opt out by setting showAmbientBg = false;
     * they render their own grade-themed dark headers and light content area.
     */
    <div
      className={`relative w-full min-h-[100dvh] ${
        showAmbientBg ? 'animate-grade-bg text-textOnDark' : 'bg-background text-textPrimary'
      } transition-colors duration-700 overflow-hidden`}
    >
      {/* Persistent ambient animated background — only on non-card screens */}
      {showAmbientBg && <SpectralClouds />}

      {/* Radial vignette overlay for depth */}
      {showAmbientBg && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />
      )}

      {/* Screen content — sits above the background layers */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col">
        {currentScreen === 'home' && (
          <HomeView
            stats={stats}
            onStartScan={() => setCurrentScreen('scanner')}
            onOpenCatalog={() => setCurrentScreen('catalog')}
            onResetStats={handleResetStats}
          />
        )}

        {currentScreen === 'catalog' && (
          <CatalogView
            onSelectCard={handleSelectCardFromCatalog}
            onBack={handleGoHome}
          />
        )}

        {currentScreen === 'scanner' && (
          <ScannerView
            onScanSuccess={handleScanSuccess}
            onBack={handleGoHome}
          />
        )}

        {currentScreen === 'problem' && activeCard && (
          <ProblemView
            card={activeCard}
            onSelectAnswer={handleSelectAnswer}
            onBack={handleGoHome}
          />
        )}

        {currentScreen === 'feedback' && activeCard && selectedAnswer && (
          <FeedbackView
            card={activeCard}
            selectedAnswer={selectedAnswer}
            onNextScan={() => {
              setActiveCard(null);
              setSelectedAnswer(null);
              setCurrentScreen('scanner');
            }}
            onGoHome={handleGoHome}
          />
        )}

        {currentScreen === 'not-found' && (
          <CardNotFoundView
            scannedCode={lastScannedCode}
            onRetryScan={() => setCurrentScreen('scanner')}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </div>
  );
};

export default App;
