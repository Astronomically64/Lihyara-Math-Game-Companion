import React, { useState, useEffect, useCallback } from 'react';
import { HomeView } from './components/HomeView';
import { ScannerView } from './components/ScannerView';
import { ProblemView } from './components/ProblemView';
import { FeedbackView } from './components/FeedbackView';
import { CatalogView } from './components/CatalogView';
import { CardNotFoundView } from './components/CardNotFoundView';
import { SpectralClouds } from './components/SpectralClouds';
import { Card, AnswerOption } from './types/card';
import {
  getCardById,
  parseQrPayload,
} from './utils/cardService';

type ScreenState = 'home' | 'scanner' | 'problem' | 'feedback' | 'catalog' | 'not-found';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
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
      // Update URL query param without full page reload
      const newUrl = `${window.location.pathname}?card=${card.qrId}`;
      window.history.pushState({ cardId: card.qrId }, '', newUrl);
    } else {
      setActiveCard(null);
      setCurrentScreen('not-found');
    }
  }, []);

  // Check URL on start or back button (e.g. ?card=g7e01 or #/card/g7e01)
  useEffect(() => {
    const checkUrlRoute = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const cardParam = urlParams.get('card');
      if (cardParam) {
        openCardPage(cardParam);
        return;
      }

      // Check hash route (e.g. #/card/g7e01)
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

  // Handle successful QR scan
  const handleScanSuccess = (rawPayload: string) => {
    openCardPage(rawPayload);
  };

  // Handle card selection from the 129 cards catalog
  const handleSelectCardFromCatalog = (card: Card) => {
    setActiveCard(card);
    setSelectedAnswer(null);
    setCurrentScreen('problem');
    const newUrl = `${window.location.pathname}?card=${card.qrId}`;
    window.history.pushState({ cardId: card.qrId }, '', newUrl);
  };

  // Handle answer selection on Problem screen
  const handleSelectAnswer = (option: AnswerOption) => {
    setSelectedAnswer(option);
    setCurrentScreen('feedback');
  };

  // Return to home and clear URL card query
  const handleGoHome = () => {
    setActiveCard(null);
    setSelectedAnswer(null);
    setCurrentScreen('home');
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <main className={`relative w-full min-h-[100dvh] ${currentScreen === 'problem' || currentScreen === 'feedback' ? 'bg-background' : 'animate-grade-bg'}`}>
      {currentScreen !== 'problem' && currentScreen !== 'feedback' && currentScreen !== 'scanner' && (
        <>
          <SpectralClouds />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/60 opacity-40 pointer-events-none" />
        </>
      )}
      <div className="relative z-10 min-h-[100dvh]">
      {currentScreen === 'home' && (
        <HomeView
          onStartScan={() => setCurrentScreen('scanner')}
          onOpenCatalog={() => setCurrentScreen('catalog')}
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
    </main>
  );
};

export default App;
