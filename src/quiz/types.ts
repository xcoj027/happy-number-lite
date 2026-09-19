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





export interface GeneratedQuiz {
  questionText: string;
  correctAnswer: string;
  answers: string[];
  topic: string;
  explanation?: string;

  questionText_en?: string;
  correctAnswer_en?: string;
  answers_en?: string[];
  explanation_en?: string;
  topic_en?: string;
}


export interface IQuizGenerator {
  get(): GeneratedQuiz;
  dynamicQuiz(): GeneratedQuiz;
  fixedQuiz(): GeneratedQuiz;
}

export interface IFixedQuizSource {
  getOne(): GeneratedQuiz;
}






export type ElementaryGrade = 1 | 2 | 3 | 4 | 5;


export type GradeLevel = ElementaryGrade | 'multiplicationTable' | null;


export function isElementaryGrade(grade: unknown): grade is ElementaryGrade {
  return typeof grade === 'number' && Number.isInteger(grade) && grade >= 1 && grade <= 5;
}




export type Subject = 'math';
