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
import { IQuizGenerator, GeneratedQuiz } from './types';


export abstract class BaseQuizGenerator implements IQuizGenerator {

  get(): GeneratedQuiz {
    return Math.random() < 0.3 ? this.fixedQuiz() : this.dynamicQuiz();
  }

  abstract dynamicQuiz(): GeneratedQuiz;
  abstract fixedQuiz(): GeneratedQuiz;

  protected shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  protected pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  protected makeQuiz(
    questionText: string,
    correct: string,
    wrong: string[],
    topic: string,
    explanation?: string,
  ): GeneratedQuiz {

    const seen = new Set<string>([correct]);
    const uniqueWrong: string[] = [];
    for (const w of wrong) {
      if (!seen.has(w)) {
        seen.add(w);
        uniqueWrong.push(w);
      }
      if (uniqueWrong.length === 3) break;
    }


    let pad = 1;
    while (uniqueWrong.length < 3) {
      const candidate = `${correct}_${pad}`;
      if (!seen.has(candidate)) {
        seen.add(candidate);
        uniqueWrong.push(candidate);
      }
      pad++;
    }

    return {
      questionText,
      correctAnswer: correct,
      answers: this.shuffle([correct, ...uniqueWrong]),
      topic,
      explanation,
    };
  }


  protected k(expr: string): string {
    return `$${expr}$`;
  }


  protected randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  protected gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }


  protected comb(n: number, k: number): number {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = (result * (n - i)) / (i + 1);
    }
    return Math.round(result);
  }


  protected perm(n: number, k: number): number {
    let result = 1;
    for (let i = 0; i < k; i++) result *= n - i;
    return result;
  }
}
