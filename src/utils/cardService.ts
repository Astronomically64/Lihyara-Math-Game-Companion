import cardsJson from '../data/cards.json';
import { Card, CardsData } from '../types/card';

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

// ----------------------------------------------------
// Smart Input Answer Validation
// ----------------------------------------------------
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[₱$°'"`]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ' ')
    .trim();
}

/**
 * Evaluates whether a user's typed answer matches the expected answer for a card.
 */
export function validateInputAnswer(card: Card, userInput: string): boolean {
  if (!userInput || !userInput.trim()) return false;

  const rawUser = userInput.trim().toLowerCase();
  const normUser = normalizeText(userInput);

  // 1. Direct match on expectedAnswer
  if (rawUser === card.expectedAnswer.toLowerCase().trim() || normUser === normalizeText(card.expectedAnswer)) {
    return true;
  }

  // 2. Check acceptableAnswers list
  if (card.acceptableAnswers && card.acceptableAnswers.length > 0) {
    for (const acceptable of card.acceptableAnswers) {
      if (
        rawUser === acceptable.toLowerCase().trim() ||
        normUser === normalizeText(acceptable)
      ) {
        return true;
      }
    }
  }

  // 3. Numeric & Fraction Equivalence (e.g. 1/2 vs 0.5 or 0.375 vs 3/8)
  try {
    const parseNumOrFrac = (str: string): number | null => {
      const s = normalizeText(str).replace(/[a-z]/g, '').trim();
      if (!s) return null;
      if (s.includes('/')) {
        const [n, d] = s.split('/').map(Number);
        if (d && !isNaN(n) && !isNaN(d)) return n / d;
      }
      const val = parseFloat(s);
      return isNaN(val) ? null : val;
    };

    const userVal = parseNumOrFrac(userInput);
    const expectedVal = parseNumOrFrac(card.expectedAnswer);

    if (userVal !== null && expectedVal !== null) {
      if (Math.abs(userVal - expectedVal) < 0.001) {
        return true;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }

  return false;
}

/**
 * Helper to get user-friendly label for category
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'polygons-angles': 'POLYGONS & ANGLES',
    'fractions-rational': 'FRACTIONS & RATIONALS',
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
  if (diff === 3) return 'Medium';
  if (diff === 5) return 'Difficult';
  return 'Standard';
}
