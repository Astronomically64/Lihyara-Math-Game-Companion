export type QuestionType = 'multiple_choice' | 'input' | 'true_false';

export interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

export interface Card {
  qrId: string;
  grade: 7 | 8 | 9 | 10;
  category: string;
  difficulty: 1 | 3 | 5;
  title?: string;
  questionType: QuestionType;
  expectedAnswer: string;
  acceptableAnswers: string[];
  problemText: string;
  imageRes: string | null;
  answers: AnswerOption[];
  solution: string;
}

export interface CardsData {
  cards: Card[];
}

export interface GameStats {
  correct: number;
  incorrect: number;
}
