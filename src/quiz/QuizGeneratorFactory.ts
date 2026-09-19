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
import { IQuizGenerator, Subject, GradeLevel } from './types';
import { MultiplicationTableQuizGenerator } from './generators/math/MultiplicationTableQuizGenerator';
import { Grade1QuizGenerator }  from './generators/math/Grade1QuizGenerator';
import { Grade2QuizGenerator }  from './generators/math/Grade2QuizGenerator';
import { Grade3QuizGenerator }  from './generators/math/Grade3QuizGenerator';
import { Grade4QuizGenerator }  from './generators/math/Grade4QuizGenerator';
import { Grade5QuizGenerator }  from './generators/math/Grade5QuizGenerator';

export class QuizGeneratorFactory {
  static create(subject: Subject, grade: GradeLevel): IQuizGenerator {
    switch (subject) {
      case 'math':
        return QuizGeneratorFactory.createMath(grade);
      default:
        throw new Error(`QuizGeneratorFactory: unsupported subject "${subject}"`);
    }
  }

  private static createMath(grade: GradeLevel): IQuizGenerator {
    if (grade === 'multiplicationTable') return new MultiplicationTableQuizGenerator();
    switch (grade) {
      case 1:  return new Grade1QuizGenerator();
      case 2:  return new Grade2QuizGenerator();
      case 3:  return new Grade3QuizGenerator();
      case 4:  return new Grade4QuizGenerator();
      case 5:  return new Grade5QuizGenerator();
      default:
        throw new Error(`QuizGeneratorFactory: unsupported math grade "${grade}"`);
    }
  }
}
