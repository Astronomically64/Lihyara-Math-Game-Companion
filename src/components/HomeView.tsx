import React from 'react';
import { Compass, QrCode, BookOpen } from 'lucide-react';
import { getTotalCardsCount } from '../utils/cardService';

interface HomeViewProps {
  onStartScan: () => void;
  onOpenCatalog: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartScan,
  onOpenCatalog,
}) => {
  const totalCards = getTotalCardsCount();

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between p-[clamp(1rem,4vw,3rem)] max-w-5xl mx-auto select-none text-textOnDark transition-colors duration-1000 overflow-hidden">
      {/* Top Bar with catalog access */}
      <div className="flex items-center justify-end pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCatalog}
            className="px-3 py-1.5 rounded-full bg-surfaceCard border border-textMuted/20 text-xs font-semibold text-primaryTeal flex items-center gap-1.5 shadow-sm hover:bg-surfaceCard/80 active:scale-95 transition-all"
            title={`Browse all ${totalCards} cards`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Card Deck</span>
          </button>

        </div>
      </div>

      {/* Main Branding Section */}
      <div className="my-auto flex flex-col items-center text-center py-6 z-10">
        {/* Centered Circular Icon Frame */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-white/25 flex items-center justify-center mb-5 bg-black/30 backdrop-blur-md shadow-lg">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center">
            <Compass className="w-12 h-12 sm:w-14 sm:h-14 text-accentGold stroke-[1.5] animate-spin-slow" />
          </div>
        </div>

        {/* Wordmark & Subtitle */}
        <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-serif font-bold text-white tracking-tight mb-1 drop-shadow-md">
          Baniwara
        </h1>
        <p className="text-[clamp(0.75rem,1.5vw,1rem)] font-semibold tracking-[0.25em] text-accentGold uppercase drop-shadow-sm">
          Math Quest of Bicol
        </p>

        <p className="mt-3 text-[clamp(0.75rem,1.2vw,1rem)] text-white/85 max-w-[38rem] leading-relaxed font-normal drop-shadow-sm">
          The interactive web companion for the physical board game. Scan any card QR code or browse quests to play.
        </p>
      </div>

      {/* Bottom Section: CTA Buttons */}
      <div className="flex flex-col gap-3 pb-4 z-10">
        {/* Primary CTA Button (Terracotta/Gold Glow) */}
        <button
          onClick={onStartScan}
          className="w-full py-4 px-6 rounded-full bg-accentTerracotta hover:bg-accentTerracotta/90 text-textOnDark font-bold text-base shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-white/20"
        >
          <QrCode className="w-5 h-5 text-textOnDark" />
          <span>Scan Location Card</span>
        </button>

        {/* Secondary Browse Deck Button */}
        <button
          onClick={onOpenCatalog}
          className="w-full py-3 px-6 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 backdrop-blur-md shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <BookOpen className="w-4 h-4 text-accentGold" />
          <span>Browse {totalCards} Cards Deck</span>
        </button>

        {/* QR Code Gallery Link for Testing */}
        <a
          href="/test-qr.html"
          target="_blank"
          rel="noreferrer"
          className="text-center text-[11px] text-white/70 hover:text-white font-medium pt-1 underline transition-colors"
        >
          View all {totalCards} QR Codes Gallery (Print / Screen)
        </a>
      </div>
    </div>
  );
};
