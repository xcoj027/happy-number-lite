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

export class Grade1QuizGenerator extends BaseQuizGenerator {

  dynamicQuiz(): GeneratedQuiz {
    return this.pick([
      this.addition.bind(this),
      this.subtraction.bind(this),
    ])();
  }

  fixedQuiz(): GeneratedQuiz {
    return this.dynamicQuiz();
  }

  private addition(): GeneratedQuiz {
    const a = this.randInt(0, 99);
    const b = this.randInt(0, 100 - a);
    const correct = a + b;
    return this.makeQuiz(
      `${a} + ${b} = ?`,
      `${correct}`,
      this.wrongNumbers(correct, 10),
      'Addition',
      `${a} + ${b} = ${correct}`,
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
      `${a} − ${b} = ${correct}`,
    );
  }

  private wrongNumbers(correct: number, variance: number): string[] {
    const wrongs = new Set<number>();
    let attempts = 0;
    while (wrongs.size < 3 && attempts < 50) {
      const offset = this.randInt(-variance, variance);
      const candidate = correct + offset;
      if (candidate !== correct && candidate >= 0) wrongs.add(candidate);
      attempts++;
    }
    return [...wrongs].map(String);
  }
}
