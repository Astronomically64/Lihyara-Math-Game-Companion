import React, { useState, useMemo } from 'react';
import { Card } from '../types/card';
import { getAllCards, getCategoryLabel, getDifficultyLabel } from '../utils/cardService';
import { ArrowLeft, Search, QrCode, Sparkles } from 'lucide-react';

interface CatalogViewProps {
  onSelectCard: (card: Card) => void;
  onBack: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectCard, onBack }) => {
  const allCards = useMemo(() => getAllCards(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedDiff, setSelectedDiff] = useState<number | 'all'>('all');

  // Filter cards
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      // Grade filter
      if (selectedGrade !== 'all' && card.grade !== selectedGrade) return false;
      // Difficulty filter
      if (selectedDiff !== 'all' && card.difficulty !== selectedDiff) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = card.qrId.toLowerCase().includes(q);
        const matchesTitle = card.title?.toLowerCase().includes(q);
        const matchesProblem = card.problemText.toLowerCase().includes(q);
        const matchesCat = card.category.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesProblem || matchesCat;
      }
      return true;
    });
  }, [allCards, selectedGrade, selectedDiff, searchQuery]);

  return (
    <div className="min-h-[100dvh] w-full max-w-6xl mx-auto bg-background/85 backdrop-blur-sm p-[clamp(1rem,4vw,3rem)] pt-[clamp(1.5rem,5vw,3rem)] pb-[clamp(2rem,5vw,4rem)] select-none flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surfaceCard border border-textMuted/15 shadow-sm flex items-center justify-center text-textPrimary hover:bg-surfaceCard/80 active:scale-95 transition-all"
            aria-label="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-serif font-bold text-textPrimary">Card Catalog</h1>
            <span className="text-[11px] font-semibold text-primaryTeal uppercase tracking-wider">
              All 129 Board Game Cards
            </span>
          </div>

          <div className="w-10" />
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search card ID, formula, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surfaceCard text-sm text-textPrimary rounded-2xl border border-textMuted/20 focus:border-primaryTeal focus:outline-none shadow-sm"
          />
        </div>

        {/* Grade Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGrade === 'all'
                ? 'bg-primaryTeal text-white shadow-sm'
                : 'bg-surfaceCard text-textMuted border border-textMuted/20'
            }`}
          >
            All Grades ({allCards.length})
          </button>
          {[7, 8, 9, 10].map((grade) => {
            const count = allCards.filter((c) => c.grade === grade).length;
            return (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGrade === grade
                    ? 'bg-primaryTeal text-white shadow-sm'
                    : 'bg-surfaceCard text-textMuted border border-textMuted/20'
                }`}
              >
                Grade {grade} ({count})
              </button>
            );
          })}
        </div>

        {/* Difficulty Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            onClick={() => setSelectedDiff('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedDiff === 'all'
                ? 'bg-accentGold text-textPrimary shadow-sm'
                : 'bg-surfaceCard text-textMuted border border-textMuted/20'
            }`}
          >
            All Difficulties
          </button>
          {[
            { level: 1, label: 'Easy' },
            { level: 3, label: 'Medium' },
            { level: 5, label: 'Difficult' },
          ].map((d) => (
            <button
              key={d.level}
              onClick={() => setSelectedDiff(d.level)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedDiff === d.level
                  ? 'bg-accentGold text-textPrimary shadow-sm'
                  : 'bg-surfaceCard text-textMuted border border-textMuted/20'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Cards Count Summary */}
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-xs text-textMuted font-medium">
            Showing {filteredCards.length} cards
          </span>
          <span className="text-[11px] text-accentGold font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Tap card to open
          </span>
        </div>

        {/* Card List */}
        <div className="flex flex-col gap-3">
          {filteredCards.map((card) => {
            const diffName = getDifficultyLabel(card.difficulty);
            const catLabel = getCategoryLabel(card.category);

            return (
              <button
                key={card.qrId}
                onClick={() => onSelectCard(card)}
                className="w-full text-left bg-surfaceCard rounded-2xl p-4 border border-black/5 shadow-soft hover:border-primaryTeal/40 active:scale-[0.99] transition-all group flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-primaryTeal/10 text-primaryTeal font-mono text-[11px] font-bold">
                      {card.qrId.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-medium text-textMuted">
                      Grade {card.grade} • {diffName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-accentGold">
                      {catLabel}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-textPrimary group-hover:text-primaryTeal transition-colors mb-1">
                    {card.title || `Quest ${card.qrId.toUpperCase()}`}
                  </h3>

                  <p className="text-xs text-textPrimary/80 line-clamp-2 leading-relaxed">
                    {card.problemText}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-background border border-textMuted/20 flex items-center justify-center text-primaryTeal group-hover:bg-primaryTeal group-hover:text-white transition-colors shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
              </button>
            );
          })}

          {filteredCards.length === 0 && (
            <div className="text-center py-12 bg-surfaceCard rounded-3xl border border-textMuted/15 p-6">
              <p className="text-sm font-serif text-textPrimary font-bold mb-1">No cards match your filter</p>
              <p className="text-xs text-textMuted">Try clearing your search query or selecting all grades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
