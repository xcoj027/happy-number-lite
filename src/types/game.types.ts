/*
 * Happy Number - Open Source Math Game
 *
 * This is an open-source project of https://math-hero.online and https://happy-number.online
 * The author of this project is TNQ MEDIA
 * GitHub: https://github.com/xcoj027/happy-number-lite
 *
 * You are free to clone, modify, contribute, fork, and build commercial products
 * from this project. All pull requests are welcome.
 * You can also open any issues or report bugs.

 */
export interface Question {
  num1: number;
  num2: number;
  operation: string;
  correctAnswer: number;
  answers: number[];
}

export type { GeneratedQuiz, IQuizGenerator, ElementaryGrade, GradeLevel, Subject } from '../quiz/types';
export { isElementaryGrade } from '../quiz/types';

export interface CompletedLevel {
  level: number;
  success: boolean;
}

export interface AnsweredQuestion {
  level: number;
  num1: number;
  num2: number;
  operation: string;
  correctAnswer: number;
  selectedAnswer: number;
  allAnswers: number[];
  questionText?: string;
  answerLabels?: string[];
  explanation?: string;
  topic?: string;
  isCorrect: boolean;
  isTimeout: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  isHost: boolean;
  answered?: boolean;
  answeredCorrectly?: boolean;
  team?: 'A' | 'B' | null;
}
