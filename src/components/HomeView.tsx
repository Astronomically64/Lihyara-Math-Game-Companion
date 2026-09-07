import React from 'react';
import { Compass, QrCode, RotateCcw, BookOpen } from 'lucide-react';
import { GameStats } from '../types/card';

interface HomeViewProps {
  stats: GameStats;
  onStartScan: () => void;
  onOpenCatalog: () => void;
  onResetStats: () => void;
}

/*
 * HomeView — no longer owns the SpectralClouds background; that is rendered
 * by the App shell so it persists across non-card screens without re-mounting.
 * Layout: full-screen flex column, content centered inside a max-width column
 * so it reads well on both phone and wide desktop.
 */
export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  onStartScan,
  onOpenCatalog,
  onResetStats,
}) => {
  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full min-h-[100dvh] select-none">
      {/* Centered content column — responsive max-width */}
      <div className="w-full max-w-lg px-6 sm:px-10 flex flex-col justify-between min-h-[100dvh] py-6 sm:py-10 mx-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-end pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCatalog}
              className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-xs font-semibold text-accentGold flex items-center gap-1.5 shadow-sm hover:bg-black/50 active:scale-95 transition-all"
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
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main Branding Section */}
        <div className="my-auto flex flex-col items-center text-center py-8 gap-5">
          {/* Circular Icon Frame */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-2 border-white/25 flex items-center justify-center bg-black/30 backdrop-blur-md shadow-2xl">
            <div className="w-20 h-20 sm:w-26 sm:h-26 lg:w-28 lg:h-28 rounded-full bg-white/10 flex items-center justify-center">
              <Compass className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-accentGold stroke-[1.5] animate-spin-slow" />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-[-8px] rounded-full border border-white/10 animate-pulse" />
          </div>

          {/* Wordmark */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight drop-shadow-md">
              Lihyara
            </h1>
            <p className="text-xs sm:text-sm font-bold tracking-[0.3em] text-accentGold uppercase drop-shadow-sm mt-1">
              Math Quest of Bicol
            </p>
          </div>

          <p className="text-xs sm:text-sm text-white/80 max-w-[300px] leading-relaxed font-normal drop-shadow-sm">
            The interactive web companion for the board game. Scan any card QR code or browse quests.
          </p>

          {/* Decorative Bicol-themed divider */}
          <div className="flex items-center gap-3 opacity-40">
            <div className="h-px w-12 bg-accentGold" />
            <span className="text-accentGold text-xs">✦</span>
            <div className="h-px w-12 bg-accentGold" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-3 pb-2">
          {/* Stat Card */}
          <div className="bg-black/35 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/15 flex items-center justify-around text-white">
            <div className="flex-1 text-center">
              <span className="block text-[11px] font-bold tracking-wider text-emerald-300 uppercase mb-1">
                Correct
              </span>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-emerald-400">
                {stats.correct}
              </span>
            </div>

            <div className="w-px h-10 bg-white/20" />

            <div className="flex-1 text-center">
              <span className="block text-[11px] font-bold tracking-wider text-red-300 uppercase mb-1">
                Incorrect
              </span>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-red-400">
                {stats.incorrect}
              </span>
            </div>

            {total > 0 && (
              <>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex-1 text-center">
                  <span className="block text-[11px] font-bold tracking-wider text-amber-300 uppercase mb-1">
                    Accuracy
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                    {accuracy}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={onStartScan}
            className="w-full py-4 px-6 rounded-full bg-accentTerracotta hover:bg-accentTerracotta/90 text-textOnDark font-bold text-base shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-white/20"
          >
            <QrCode className="w-5 h-5 text-textOnDark" />
            <span>Scan Location Card</span>
          </button>

          {/* Secondary Browse Button */}
          <button
            onClick={onOpenCatalog}
            className="w-full py-3 px-6 rounded-full bg-white/12 hover:bg-white/22 text-white font-bold text-sm border border-white/20 backdrop-blur-md shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <BookOpen className="w-4 h-4 text-accentGold" />
            <span>Browse 129 Cards Deck</span>
          </button>

          {/* QR Gallery link */}
          <a
            href="/test-qr.html"
            target="_blank"
            rel="noreferrer"
            className="text-center text-[11px] text-white/60 hover:text-white font-medium pt-1 underline transition-colors"
          >
            View all 129 QR Codes Gallery (Print / Screen)
          </a>
        </div>
      </div>
    </div>
  );
};
