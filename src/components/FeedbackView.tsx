import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card, AnswerOption } from '../types/card';
import { Check, X, BookOpen, ChevronRight } from 'lucide-react';

interface FeedbackViewProps {
  card: Card;
  selectedAnswer: AnswerOption;
  onNextScan: () => void;
  onGoHome: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  card,
  selectedAnswer,
  onNextScan,
  onGoHome,
}) => {
  const isCorrect = selectedAnswer.isCorrect;
  const isSpecialChallenge = card.portalTheme === true || card.category === 'final-challenge';
  const movementSteps = card.difficulty === 1 ? 1 : card.difficulty === 3 ? 2 : 3;
  const movementMessage = isSpecialChallenge
    ? `You've answered ${isCorrect ? 'right' : 'wrong'}`
    : isCorrect
      ? `Move ${movementSteps} ${movementSteps === 1 ? 'tile' : 'tiles'} forward`
      : `Move ${movementSteps} ${movementSteps === 1 ? 'tile' : 'tiles'} backward`;

  // Fire celebratory confetti on correct answer
  useEffect(() => {
    if (isCorrect) {
      try {
        confetti({
          particleCount: 80,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#1E5452', '#C9A227', '#C15A3C', '#FAF7F1'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isCorrect]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between max-w-5xl mx-auto bg-background select-none">
      <div>
        {/* Header Banner (Dark Teal Gradient) */}
        <div className="relative bg-gradient-to-br from-headerTeal-start to-headerTeal-end text-textOnDark rounded-b-[clamp(1.5rem,4vw,2.5rem)] p-[clamp(1.25rem,4vw,2.5rem)] pt-[clamp(1.5rem,5vw,3rem)] pb-[clamp(2rem,5vw,3.5rem)] shadow-md text-center">
          {/* Status Icon in Filled Circle */}
          <div className="flex justify-center mb-3">
            {isCorrect ? (
              <div className="w-16 h-16 rounded-full bg-accentGold flex items-center justify-center shadow-md animate-bounce">
                <Check className="w-9 h-9 text-textOnDark stroke-[3]" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-accentTerracotta flex items-center justify-center shadow-md">
                <X className="w-9 h-9 text-textOnDark stroke-[3]" />
              </div>
            )}
          </div>

          {/* Heading & Subtitle */}
          <h2 className="text-3xl font-serif font-bold text-textOnDark tracking-tight mb-1">
            {isCorrect ? 'Brilliant!' : 'Not Quite!'}
          </h2>
          <p className="text-xs sm:text-sm text-textOnDark/85 font-medium">
            {isCorrect ? 'You solved the challenge.' : 'Review the worked solution below.'}
          </p>
          <div className={`mx-auto mt-5 max-w-sm rounded-2xl border px-4 py-3 text-center ${isCorrect ? 'border-accentGold/50 bg-accentGold/20' : 'border-accentTerracotta/60 bg-accentTerracotta/20'}`}>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
              {isSpecialChallenge ? 'Answer result' : 'Board move'}
            </span>
            <span className="mt-1 block text-lg font-serif font-bold text-white">{movementMessage}</span>
          </div>
        </div>

        {/* Answer Breakdown Card */}
        <div className="px-[clamp(1rem,4vw,3rem)] -mt-[clamp(1.25rem,3vw,1.5rem)]">
          <div className="bg-surfaceCard rounded-3xl p-[clamp(1.25rem,4vw,2.5rem)] shadow-soft border border-black/5 mb-4">
            {/* User Submitted Answer Row */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-textMuted/15">
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-textMuted uppercase">
                    Your Submitted Answer
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold text-textPrimary">
                    {selectedAnswer.text}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-primaryTeal text-white' : 'bg-accentTerracotta text-white'}`}>
                  {isCorrect ? <Check className="w-5 h-5 stroke-[2.5]" /> : <X className="w-5 h-5 stroke-[2.5]" />}
                </div>
              </div>

              {/* Revealed Correct Answer if User was Wrong */}
              {!isCorrect && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primaryTeal/10 border border-primaryTeal/30">
                  <div>
                    <span className="block text-[10px] font-bold tracking-wider text-primaryTeal uppercase">
                      Official Expected Answer
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-primaryTeal">
                      {card.expectedAnswer}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primaryTeal text-white flex items-center justify-center">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-surfaceCard rounded-3xl p-[clamp(1.25rem,4vw,2.5rem)] shadow-soft border border-black/5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primaryTeal" />
              <span className="text-xs font-bold tracking-wider text-primaryTeal uppercase">
                Worked Solution
              </span>
            </div>
            <p className="text-sm text-textPrimary leading-relaxed font-sans">
              {card.solution}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full p-[clamp(1rem,4vw,3rem)] pb-[clamp(1.5rem,4vw,3rem)] flex flex-col gap-3">
        <button
          onClick={onNextScan}
          className="w-full py-4 px-6 rounded-full bg-primaryTeal text-textOnDark font-bold text-base shadow-soft-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span>Explore Next Location</span>
          <ChevronRight className="w-5 h-5 text-textOnDark" />
        </button>

        <button
          onClick={onGoHome}
          className="w-full py-3 px-4 rounded-full text-xs font-semibold text-textMuted hover:text-textPrimary text-center"
        >
          Return to Quest Home
        </button>
      </div>
    </div>
  );
};
