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
import { GeneratedQuiz } from '../../types';
import { BaseQuizGenerator } from '../../BaseQuizGenerator';

export class Grade2QuizGenerator extends BaseQuizGenerator {

  dynamicQuiz(): GeneratedQuiz {
    return this.pick([
      this.addition.bind(this),
      this.subtraction.bind(this),
      this.multiplication.bind(this),
      this.division.bind(this),
    ])();
  }

  fixedQuiz(): GeneratedQuiz {
    return this.dynamicQuiz();
  }

  private addition(): GeneratedQuiz {
    const a = this.randInt(0, 100);
    const b = this.randInt(0, 100);
    const correct = a + b;
    return this.makeQuiz(
      `${a} + ${b} = ?`,
      `${correct}`,
      this.wrongNumbers(correct, 10),
      'Addition',
    );
  }

  private subtraction(): GeneratedQuiz {
    const a = this.randInt(1, 100);
    const b = this.randInt(0, a);
    const correct = a - b;
    return this.makeQuiz(
      `${a} − ${b} = ?`,
      `${correct}`,
      this.wrongNumbers(correct, 10),
      'Subtraction',
    );
  }

  private multiplication(): GeneratedQuiz {
    const a = this.randInt(1, 10);
    const b = this.randInt(1, 10);
    const correct = a * b;
    return this.makeQuiz(
      `${a} × ${b} = ?`,
      `${correct}`,
      this.wrongNumbers(correct, 10),
      'Multiplication',
      `${a} × ${b} = ${correct}`,
    );
  }

  private division(): GeneratedQuiz {
    const divisor = this.randInt(2, 10);
    const quotient = this.randInt(1, 10);
    const dividend = divisor * quotient;
    return this.makeQuiz(
      `${dividend} ÷ ${divisor} = ?`,
      `${quotient}`,
      this.wrongNumbers(quotient, 5, 1),
      'Division',
      `${dividend} ÷ ${divisor} = ${quotient}`,
    );
  }

  private wrongNumbers(correct: number, variance: number, min = 0): string[] {
    const wrongs = new Set<number>();
    let attempts = 0;
    while (wrongs.size < 3 && attempts < 50) {
      const candidate = correct + this.randInt(-variance, variance);
      if (candidate !== correct && candidate >= min) wrongs.add(candidate);
      attempts++;
    }
    return [...wrongs].map(String);
  }
}
