export type QuestionType = 'multiple_choice' | 'input' | 'true_false';

export interface AnswerOption {
  text: string;
  isCorrect: boolean;
  imageRes?: string;
}

export interface Card {
  qrId: string;
  grade: 7 | 8 | 9 | 10;
  category: string;
  difficulty: 1 | 3 | 5;
  title?: string;
  portalTheme?: boolean;
  questionType: QuestionType;
  expectedAnswer: string;
  acceptableAnswers: string[];
  problemText: string;
  imageRes: string | string[] | null;
  answers: AnswerOption[];
  solution: string;
}

export interface CardsData {
  cards: Card[];
}

