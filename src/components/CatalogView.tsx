import React, { useState, useMemo } from 'react';
import { Card } from '../types/card';
import { getAllCards, getCategoryLabel, getDifficultyLabel } from '../utils/cardService';
import { ArrowLeft, Search, QrCode, Sparkles } from 'lucide-react';

interface CatalogViewProps {
  onSelectCard: (card: Card) => void;
  onBack: () => void;
}

/*
 * CatalogView — sits on the ambient animated background (rendered by App shell).
 * Uses a semi-transparent dark-glass aesthetic to match the Lihyara game theme
 * while remaining readable on any screen size.
 * Deviation: switched from plain cream bg to dark-glass-on-background style
 * to keep visual continuity with the Home screen ambient background.
 */
export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectCard, onBack }) => {
  const allCards = useMemo(() => getAllCards(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedDiff, setSelectedDiff] = useState<number | 'all'>('all');

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (selectedGrade !== 'all' && card.grade !== selectedGrade) return false;
      if (selectedDiff !== 'all' && card.difficulty !== selectedDiff) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          card.qrId.toLowerCase().includes(q) ||
          card.title?.toLowerCase().includes(q) ||
          card.problemText.toLowerCase().includes(q) ||
          card.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allCards, selectedGrade, selectedDiff, searchQuery]);

  const gradeColors: Record<number, string> = {
    7: 'from-[#143d2b] to-[#2d7a4d]',
    8: 'from-[#4a3205] to-[#b38312]',
    9: 'from-[#4d0c0c] to-[#b91c1c]',
    10: 'from-[#0b2545] to-[#0077b6]',
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full min-h-[100dvh] select-none">
      <div className="w-full max-w-2xl px-5 sm:px-8 mx-auto flex flex-col min-h-[100dvh] pb-12">

        {/* Sticky glass header */}
        <div className="sticky top-0 z-20 pt-8 pb-4 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-sm">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all"
              aria-label="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h1 className="text-xl font-serif font-bold text-white">Card Catalog</h1>
              <span className="text-[11px] font-semibold text-accentGold uppercase tracking-wider">
                All 129 Board Game Cards
              </span>
            </div>

            <div className="w-10" />
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search card ID, formula, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 backdrop-blur-md text-sm text-white rounded-2xl border border-white/20 focus:border-accentGold focus:outline-none placeholder-white/35 shadow-sm transition-colors"
            />
          </div>

          {/* Grade Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGrade === 'all'
                  ? 'bg-white/90 text-textPrimary shadow-sm'
                  : 'bg-black/30 text-white/70 border border-white/20 hover:bg-black/50'
              }`}
            >
              All Grades ({allCards.length})
            </button>
            {[7, 8, 9, 10].map((grade) => {
              const count = allCards.filter((c) => c.grade === grade).length;
              const isActive = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? `bg-gradient-to-r ${gradeColors[grade]} text-white border-white/20 shadow-sm`
                      : 'bg-black/30 text-white/70 border-white/20 hover:bg-black/50'
                  }`}
                >
                  Grade {grade} ({count})
                </button>
              );
            })}
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-1.5 scrollbar-none">
            {[
              { level: 'all' as const, label: 'All Difficulty' },
              { level: 1, label: '⭐ Easy' },
              { level: 3, label: '⭐⭐ Average' },
              { level: 5, label: '⭐⭐⭐ Hard' },
            ].map((d) => (
              <button
                key={String(d.level)}
                onClick={() => setSelectedDiff(d.level)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
                  selectedDiff === d.level
                    ? 'bg-accentGold text-textPrimary border-accentGold/50 shadow-sm'
                    : 'bg-black/30 text-white/60 border-white/15 hover:bg-black/50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count line */}
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-xs text-white/60 font-medium">
            Showing {filteredCards.length} of {allCards.length} cards
          </span>
          <span className="text-[11px] text-accentGold font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Tap card to open
          </span>
        </div>

        {/* Card List */}
        <div className="flex flex-col gap-2.5">
          {filteredCards.map((card) => {
            const diffName = getDifficultyLabel(card.difficulty);
            const catLabel = getCategoryLabel(card.category);
            const gradeGrad = gradeColors[card.grade] ?? gradeColors[7];

            return (
              <button
                key={card.qrId}
                onClick={() => onSelectCard(card)}
                className="w-full text-left bg-black/35 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-accentGold/50 hover:bg-black/50 active:scale-[0.99] transition-all group flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md bg-gradient-to-r ${gradeGrad} text-white font-mono text-[11px] font-bold`}>
                      {card.qrId.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-medium text-white/55">
                      Grade {card.grade} • {diffName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-accentGold">
                      {catLabel}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-white group-hover:text-accentGold transition-colors mb-1 truncate">
                    {card.title || `Quest ${card.qrId.toUpperCase()}`}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {card.problemText}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/70 group-hover:bg-accentGold group-hover:text-textPrimary transition-colors shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
              </button>
            );
          })}

          {filteredCards.length === 0 && (
            <div className="text-center py-14 bg-black/30 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <p className="text-sm font-serif text-white font-bold mb-1">No cards match your filter</p>
              <p className="text-xs text-white/55">Try clearing your search or selecting all grades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
