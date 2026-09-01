import React from 'react';
import { Sparkles, Compass, QrCode, RotateCcw, BookOpen } from 'lucide-react';
import { GameStats } from '../types/card';

interface HomeViewProps {
  stats: GameStats;
  onStartScan: () => void;
  onOpenCatalog: () => void;
  onResetStats: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  onStartScan,
  onOpenCatalog,
  onResetStats,
}) => {
  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between p-6 sm:p-8 max-w-md mx-auto select-none">
      {/* Top Bar with Level Pill Badge & Catalog */}
      <div className="flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surfaceCard border border-textMuted/15 shadow-sm text-xs font-semibold text-textPrimary tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-accentGold fill-accentGold" />
          <span>Level 4 Explorer</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCatalog}
            className="px-3 py-1.5 rounded-full bg-surfaceCard border border-textMuted/20 text-xs font-semibold text-primaryTeal flex items-center gap-1.5 shadow-sm hover:bg-surfaceCard/80 active:scale-95 transition-all"
            title="Browse all 129 cards"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Card Deck</span>
          </button>

          {total > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset your session stats?')) {
                  onResetStats();
                }
              }}
              title="Reset Session Stats"
              className="p-2 rounded-full text-textMuted hover:text-textPrimary hover:bg-surfaceCard/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Branding Section */}
      <div className="my-auto flex flex-col items-center text-center py-6">
        {/* Centered Circular Icon Frame */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-primaryTeal/30 flex items-center justify-center mb-5 bg-surfaceCard/80 shadow-soft">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primaryTeal/10 flex items-center justify-center">
            <Compass className="w-12 h-12 sm:w-14 sm:h-14 text-primaryTeal stroke-[1.5]" />
          </div>
        </div>

        {/* Wordmark & Subtitle */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-textPrimary tracking-tight mb-1">
          Lihyara
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-primaryTeal uppercase">
          Math Quest of Bicol
        </p>

        <p className="mt-3 text-xs text-textMuted max-w-[280px] leading-relaxed">
          The interactive web companion for the physical board game. Scan any card QR code or browse quests to play.
        </p>
      </div>

      {/* Bottom Section: Stat Card + CTA Buttons */}
      <div className="flex flex-col gap-3 pb-4">
        {/* Stat Card */}
        <div className="bg-surfaceCard rounded-3xl p-5 shadow-soft border border-black/5 flex items-center justify-around">
          {/* Correct Column */}
          <div className="flex-1 text-center">
            <span className="block text-[11px] font-bold tracking-wider text-textMuted uppercase mb-1">
              Correct
            </span>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-primaryTeal">
              {stats.correct}
            </span>
          </div>

          {/* Thin Vertical Divider */}
          <div className="w-px h-10 bg-textMuted/20" />

          {/* Incorrect Column */}
          <div className="flex-1 text-center">
            <span className="block text-[11px] font-bold tracking-wider text-textMuted uppercase mb-1">
              Incorrect
            </span>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-accentTerracotta">
              {stats.incorrect}
            </span>
          </div>

          {/* Accuracy Badge if played */}
          {total > 0 && (
            <>
              <div className="w-px h-10 bg-textMuted/20" />
              <div className="flex-1 text-center">
                <span className="block text-[11px] font-bold tracking-wider text-textMuted uppercase mb-1">
                  Accuracy
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-textPrimary">
                  {accuracy}%
                </span>
              </div>
            </>
          )}
        </div>

        {/* Primary CTA Button (Terracotta) */}
        <button
          onClick={onStartScan}
          className="w-full py-4 px-6 rounded-full bg-accentTerracotta text-textOnDark font-bold text-base shadow-soft-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
        >
          <QrCode className="w-5 h-5 text-textOnDark" />
          <span>Scan Location Card</span>
        </button>

        {/* Secondary Browse Deck Button */}
        <button
          onClick={onOpenCatalog}
          className="w-full py-3 px-6 rounded-full bg-surfaceCard text-primaryTeal font-bold text-sm border border-primaryTeal/20 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <BookOpen className="w-4 h-4 text-primaryTeal" />
          <span>Browse 129 Cards Deck</span>
        </button>

        {/* QR Code Gallery Link for Testing */}
        <a
          href="/test-qr.html"
          target="_blank"
          rel="noreferrer"
          className="text-center text-[11px] text-textMuted hover:text-primaryTeal font-medium pt-1 underline"
        >
          View all 129 QR Codes Gallery (Print / Screen)
        </a>
      </div>
    </div>
  );
};
