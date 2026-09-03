import React, { useState, useMemo, useEffect } from 'react';
import { Card, AnswerOption } from '../types/card';
import { getCategoryLabel, getDifficultyLabel, validateInputAnswer } from '../utils/cardService';
import { ArrowLeft, Target, Send, ToggleLeft, ToggleRight, HelpCircle, Timer } from 'lucide-react';

interface ProblemViewProps {
  card: Card;
  onSelectAnswer: (selectedOption: AnswerOption) => void;
  onBack: () => void;
}

// Utility to shuffle choices deterministically
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface GradeTheme {
  gradient: string;
  pageGradient: string;
  themeName: string;
  badgeAccent: string;
  ambientColor: string;
}

function getGradeTheme(grade: number): GradeTheme {
  switch (grade) {
    case 7: // Green = Water
      return {
        gradient: 'from-[#143d2b] via-[#1e563b] to-[#2d7a4d]',
        pageGradient: 'from-[#3f8067] via-[#78b69a] to-[#c9e5d5]',
        themeName: 'Water Realm',
        badgeAccent: 'text-emerald-300',
        ambientColor: 'bg-emerald-300/35',
      };
    case 8: // Yellow = Earth
      return {
        gradient: 'from-[#4a3205] via-[#785309] to-[#b38312]',
        pageGradient: 'from-[#9d7822] via-[#d6b95e] to-[#f0e2b5]',
        themeName: 'Earth Realm',
        badgeAccent: 'text-amber-300',
        ambientColor: 'bg-amber-300/35',
      };
    case 9: // Red = Fire
      return {
        gradient: 'from-[#4d0c0c] via-[#7f1d1d] to-[#b91c1c]',
        pageGradient: 'from-[#a84f48] via-[#d58b76] to-[#f1d0c2]',
        themeName: 'Fire Realm',
        badgeAccent: 'text-red-300',
        ambientColor: 'bg-red-300/35',
      };
    case 10: // Blue = Air
    default:
      return {
        gradient: 'from-[#0b2545] via-[#134074] to-[#0077b6]',
        pageGradient: 'from-[#397da5] via-[#83bcd4] to-[#d1e9f0]',
        themeName: 'Air Realm',
        badgeAccent: 'text-sky-300',
        ambientColor: 'bg-sky-300/35',
      };
  }
}

// Special challenge timers take precedence over the regular difficulty timers.
function getInitialTimerSeconds(card: Card): number {
  if (card.portalTheme) return 120;
  if (card.category === 'final-challenge') return 150;

  const { difficulty } = card;
  if (difficulty === 1) return 30;
  if (difficulty === 3) return 60;
  if (difficulty === 5) return 90;
  return 60;
}

export const ProblemView: React.FC<ProblemViewProps> = ({ card, onSelectAnswer, onBack }) => {
  // Mode: 'input' (type exact answer) or 'multiple_choice'
  const [answerMode, setAnswerMode] = useState<'input' | 'multiple_choice'>(() => {
    return card.questionType === 'input' ? 'input' : 'multiple_choice';
  });

  const [typedInput, setTypedInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // Difficulty Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<number>(() => getInitialTimerSeconds(card));

  useEffect(() => {
    if (timeLeft <= 0) {
      onSelectAnswer({
        text: 'Time Expired',
        isCorrect: false,
      });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onSelectAnswer]);

  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Shuffle answer options once per card view
  const shuffledAnswers = useMemo(() => {
    return shuffleArray(card.answers);
  }, [card]);

  const categoryLabel = getCategoryLabel(card.category);
  const difficultyLabel = getDifficultyLabel(card.difficulty);
  const theme = getGradeTheme(card.grade);
  const isPortal = card.portalTheme === true;

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) {
      setInputError('Please enter your answer before submitting.');
      return;
    }

    const isCorrect = validateInputAnswer(card, typedInput);
    onSelectAnswer({
      text: typedInput.trim(),
      isCorrect,
    });
  };

  return (
    <div className={`relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden ${isPortal ? 'portal-card-page' : `bg-gradient-to-br ${theme.pageGradient}`} select-none`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`grade-ambient-orb absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full ${theme.ambientColor} blur-3xl`} />
        <div className={`grade-ambient-orb grade-ambient-orb-delayed absolute -bottom-48 -right-40 h-[44rem] w-[44rem] rounded-full ${theme.ambientColor} blur-3xl`} />
      </div>

      <div className="relative z-10 w-full">
        {/* Dynamic Grade-Themed Gradient Header Banner (Rounded Bottom Corners) */}
        <div className={`relative min-h-[clamp(20rem,42vh,31rem)] ${isPortal ? 'portal-card-header' : `bg-gradient-to-br ${theme.gradient}`} text-textOnDark rounded-b-[clamp(1.5rem,4vw,2.5rem)] p-[clamp(1.25rem,4vw,2.5rem)] pt-[clamp(1.5rem,5vw,3rem)] pb-[clamp(2rem,5vw,3.5rem)] shadow-md transition-colors duration-500`}>
          {/* Top navigation row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-textOnDark hover:bg-white/20 active:scale-95 transition-all"
              aria-label="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-accentGold tracking-wider uppercase">
                <Target className="w-3.5 h-3.5 text-accentGold" />
                <span>{categoryLabel}</span>
              </div>

              {/* Dynamic Difficulty Timer Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-sm border text-base sm:text-lg font-mono font-bold shadow-inner ${
                timeLeft <= 10
                  ? 'bg-red-950/80 border-red-500/50 text-red-200 animate-bounce'
                  : 'bg-black/35 border-white/15 text-white/95'
              }`} title={`Timer for ${difficultyLabel} difficulty`}>
                <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400 animate-ping' : theme.badgeAccent}`} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Grade & Difficulty Tag */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${theme.badgeAccent}`}>
              Grade {card.grade} • {theme.themeName}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-xs font-medium text-white/70">
              {difficultyLabel}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-xs font-mono text-accentGold font-bold">
              #{card.qrId.toUpperCase()}
            </span>
          </div>

          {/* Title / Quest Heading */}
          <h2 className="text-2xl font-serif font-bold text-textOnDark tracking-tight">
            {card.title || `Challenge Quest`}
          </h2>
        </div>

        {/* Overlapping Problem Text Card */}
        <div className="px-[clamp(1rem,4vw,3rem)] -mt-[clamp(1.25rem,3vw,1.5rem)]">
          <div className="bg-surfaceCard rounded-3xl p-[clamp(1.25rem,4vw,2.5rem)] shadow-soft border border-black/5">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] text-textPrimary leading-relaxed font-normal whitespace-pre-line">
              {card.problemText}
            </p>

            {/* Extension point for future image rendering if imageRes is added */}
            {card.imageRes && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-textMuted/20">
                <img
                  src={card.imageRes}
                  alt="Problem diagram"
                  className="w-full h-auto object-contain max-h-56"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer Area */}
      <div className="w-full rounded-t-[clamp(1.5rem,4vw,2.5rem)] border-t border-black/10 bg-white/75 p-[clamp(1rem,4vw,3rem)] pb-[clamp(1.5rem,4vw,3rem)] shadow-[0_-10px_30px_rgba(42,36,32,0.08)] backdrop-blur-sm">
        {/* Mode Switcher Toggle */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-bold tracking-wider text-textPrimary/80 uppercase">
            {answerMode === 'input' ? 'Type Specific Answer' : 'Select Choice'}
          </span>

          {card.questionType !== 'true_false' && (
            <button
              onClick={() => {
                setAnswerMode(answerMode === 'input' ? 'multiple_choice' : 'input');
                setInputError(null);
              }}
              className="text-xs text-primaryTeal font-semibold flex items-center gap-1.5 hover:underline"
            >
              {answerMode === 'input' ? (
                <>
                  <ToggleRight className="w-4 h-4 text-accentGold" />
                  <span>Switch to Choices</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-textPrimary/70" />
                  <span>Type Answer</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* MODE 1: Direct Specific Text/Numeric Input */}
        {answerMode === 'input' ? (
          <form onSubmit={handleInputSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Type your answer here..."
                value={typedInput}
                onChange={(e) => {
                  setTypedInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                className="w-full py-4 pl-4 pr-12 text-base font-serif bg-surfaceCard text-textPrimary rounded-2xl border-2 border-primaryTeal/30 focus:border-primaryTeal focus:outline-none shadow-soft transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 bottom-2.5 px-3.5 rounded-xl bg-primaryTeal text-textOnDark font-bold flex items-center justify-center active:scale-95 transition-transform"
                title="Submit Answer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {inputError && (
              <p className="text-xs text-accentTerracotta font-medium px-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {inputError}
              </p>
            )}

            <p className="text-[11px] text-textPrimary/75 px-2 leading-tight">
              Tip: Enter values like numbers (e.g. <span className="font-mono text-textPrimary">105</span>, <span className="font-mono text-textPrimary">0.375</span>, <span className="font-mono text-textPrimary">1/2</span>), units, or terms.
            </p>
          </form>
        ) : (
          /* MODE 2: 2x2 Answer Grid or True/False Buttons */
          <div className={`grid gap-[clamp(0.75rem,2vw,1.25rem)] ${card.answers.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => onSelectAnswer(answer)}
                className="bg-surfaceCard rounded-2xl p-[clamp(1rem,2.5vw,1.5rem)] min-h-[clamp(5.5rem,10vw,8rem)] flex items-center justify-center text-center shadow-soft border border-black/5 hover:border-primaryTeal/40 active:scale-[0.97] transition-all group"
              >
                <span className="font-serif text-base sm:text-lg font-medium text-textPrimary group-hover:text-primaryTeal transition-colors">
                  {answer.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
