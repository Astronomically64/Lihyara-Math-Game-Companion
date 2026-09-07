import cardsJson from '../data/cards.json';
import { Card, CardsData, GameStats } from '../types/card';

const data = cardsJson as CardsData;
const cardMap = new Map<string, Card>();

// Index all cards by normalized qrId
data.cards.forEach((card) => {
  cardMap.set(card.qrId.toLowerCase().trim(), card);
});

/**
 * Parses raw QR code string payload and extracts card ID.
 * Supports:
 * - Direct ID: g7e01
 * - LIHYARA payload: LIHYARA:g7e01
 * - Full URL: https://lihyara.app/?card=g7e01 or https://.../#/card/g7e01
 */
export function parseQrPayload(rawPayload: string): string {
  let cleaned = rawPayload.trim();

  // If it's a URL, extract the card param or path
  if (cleaned.includes('?card=') || cleaned.includes('&card=')) {
    const urlParams = new URLSearchParams(cleaned.split('?')[1]);
    const cardParam = urlParams.get('card');
    if (cardParam) return cardParam.toLowerCase().trim();
  }

  if (cleaned.includes('/card/')) {
    const parts = cleaned.split('/card/');
    if (parts[1]) {
      return parts[1].split('?')[0].split('#')[0].toLowerCase().trim();
    }
  }

  if (cleaned.toUpperCase().startsWith('BANIWARA:')) {
    cleaned = cleaned.substring(9).trim();
  } else if (cleaned.toUpperCase().startsWith('LIHYARA:')) {
    cleaned = cleaned.substring(8).trim();
  }

  return cleaned.toLowerCase();
}

/**
 * Retrieves a card by its qrId.
 */
export function getCardById(rawId: string): Card | undefined {
  const normalizedId = parseQrPayload(rawId);
  return cardMap.get(normalizedId);
}

/**
 * Returns all cards in the question bank.
 */
export function getAllCards(): Card[] {
  return data.cards;
}

/**
 * Returns all cards count.
 */
export function getTotalCardsCount(): number {
  return data.cards.length;
}

const STATS_STORAGE_KEY = 'lihyara_game_stats';

export function getStoredStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GameStats>;
      return {
        correct: Number(parsed.correct) || 0,
        incorrect: Number(parsed.incorrect) || 0,
      };
    }
  } catch (error) {
    console.warn('Failed to read stats from localStorage', error);
  }
  return { correct: 0, incorrect: 0 };
}

export function recordAnswer(isCorrect: boolean): GameStats {
  const current = getStoredStats();
  const updated: GameStats = {
    correct: current.correct + (isCorrect ? 1 : 0),
    incorrect: current.incorrect + (isCorrect ? 0 : 1),
  };
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save stats to localStorage', error);
  }
  return updated;
}

export function resetStoredStats(): GameStats {
  const zeroStats: GameStats = { correct: 0, incorrect: 0 };
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(zeroStats));
  } catch (error) {
    console.warn('Failed to reset stats in localStorage', error);
  }
  return zeroStats;
}

// ----------------------------------------------------
// Smart Input Answer Validation
// ----------------------------------------------------
const numberWords: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
  eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
  sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
  thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70',
  eighty: '80', ninety: '90',
};

function normalizeText(text: string): string {
  let normalized = text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/∠/g, ' angle ')
    .replace(/[×✕]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/[²]/g, '^2')
    .replace(/[³]/g, '^3')
    .replace(/[₱$€£]/g, '')
    .replace(/[°'"`]/g, '')
    .replace(/\b(answers?|response|the answer is|the correct answer is|it is)\s*:?/g, '')
    .replace(/\s*=\s*/g, '=')
    .replace(/[^a-z0-9.+\-*/^=(),/ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const [word, value] of Object.entries(numberWords)) {
    normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), value);
  }

  return normalized
    .replace(/\b(an?|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactText(text: string): string {
  return normalizeText(text).replace(/[\s,()]/g, '');
}

function answerCandidates(text: string): string[] {
  const normalized = normalizeText(text);
  const candidates = new Set([normalized, compactText(text)]);
  const alternatives = normalized.split(/\s+or\s+/).map((part) => part.trim()).filter(Boolean);

  alternatives.forEach((alternative) => {
    candidates.add(alternative);
    candidates.add(compactText(alternative));
  });

  if (/^(yes|true)\b/.test(normalized)) candidates.add('yes');
  if (/^(no|false)\b/.test(normalized)) candidates.add('no');

  const labeledChoice = normalized.match(/^(?:student|point|court|option|choice)\s+([a-d])\b/);
  if (labeledChoice) candidates.add(labeledChoice[1]);

  return [...candidates];
}

function parseNumericAnswer(text: string): number | null {
  const normalized = normalizeText(text)
    .replace(/\b(point|points|degrees?|degree|meters?|metres?|meter|m|cm|km|kg|g|hours?|hour|minutes?|minute|seconds?|second|papers?|pages?|liters?|litres?|liter|l| pesos?|php|ph)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*-?\d+(?:\.\d+)?)?$/.test(normalized)) return null;
  if (normalized.includes('/')) {
    const [numerator, denominator] = normalized.split('/').map(Number);
    return denominator ? numerator / denominator : null;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/**
 * Evaluates whether a user's typed answer matches the expected answer for a card.
 */
export function validateInputAnswer(card: Card, userInput: string): boolean {
  if (!userInput || !userInput.trim()) return false;

  const expectedAnswers = [card.expectedAnswer, ...(card.acceptableAnswers || [])];
  const userCandidates = answerCandidates(userInput);
  const expectedCandidates = expectedAnswers.flatMap(answerCandidates);

  if (userCandidates.some((candidate) => expectedCandidates.includes(candidate))) return true;

  const expectedNumericValues = expectedAnswers
    .map(parseNumericAnswer)
    .filter((value): value is number => value !== null);
  const userNumericValue = parseNumericAnswer(userInput);

  return userNumericValue !== null
    && expectedNumericValues.some((value) => Math.abs(userNumericValue - value) < 0.001);
}

/**
 * Helper to get user-friendly label for category
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'polygons-angles': 'POLYGONS & ANGLES',
    'fractions-rational': 'FRACTIONS & RATIONALS',
    'portal-challenge': 'PORTAL CHALLENGES',
    'rational-algebraic-expressions': 'RATIONAL EXPRESSIONS',
    'special-products-factoring': 'SPECIAL PRODUCTS & FACTORING',
    'linear-equations': 'LINEAR EQUATIONS',
    'quadrilaterals-geometry': 'QUADRILATERALS & GEOMETRY',
    'trigonometry': 'TRIGONOMETRY & ANGLES',
    'law-of-sines-cosines': 'LAW OF SINES & COSINES',
  };
  return labels[category] || category.replace(/-/g, ' ').toUpperCase();
}

/**
 * Helper to get human-readable difficulty label
 */
export function getDifficultyLabel(diff: number): string {
  if (diff === 1) return 'Easy';
  if (diff === 3) return 'Average';
  if (diff === 5) return 'Difficult';
  return 'Standard';
}
