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

export class MultiplicationTableQuizGenerator extends BaseQuizGenerator {

  dynamicQuiz(): GeneratedQuiz {
    return this.pick([
      this.multiplicationFact.bind(this),
      this.missingFactor.bind(this),
    ])();
  }

  fixedQuiz(): GeneratedQuiz {
    return this.dynamicQuiz();
  }

  private multiplicationFact(): GeneratedQuiz {
    const a = this.randInt(1, 9);
    const b = this.randInt(1, 9);
    const correct = a * b;
    return this.makeQuiz(
      `${a} × ${b} = ?`,
      `${correct}`,
      this.generateWrongAnswers(correct, 15),
      'Multiplication',
      `${a} × ${b} = ${correct}`,
    );
  }

  private missingFactor(): GeneratedQuiz {
    const a = this.randInt(1, 9);
    const b = this.randInt(1, 9);
    const product = a * b;
    return this.makeQuiz(
      `${a} × ? = ${product}`,
      `${b}`,
      this.generateWrongAnswers(b, 4, 1, 9),
      'Multiplication',
      `${a} × ${b} = ${product}`,
    );
  }

  private generateWrongAnswers(correct: number, variance: number, min = 1, max = 81): string[] {
    const wrongs = new Set<number>();
    let attempts = 0;
    while (wrongs.size < 3 && attempts < 50) {
      const offset = this.randInt(-variance, variance);
      const candidate = correct + offset;
      if (candidate !== correct && candidate >= min && candidate <= max) {
        wrongs.add(candidate);
      }
      attempts++;
    }
    return [...wrongs].map(String);
  }
}
