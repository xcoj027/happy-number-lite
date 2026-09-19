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
export function cleanDisplayQuestion(text: string): string {
  return text
    .replace(/\s*=\s*\?(\s*)$/, '')
    .replace(/(\$.*?)\s*=\s*\?(\s*\$)/, '$1$2')
    .replace(/\?\s*=\s*-?\d+(?:\.\d+)?(\s*\$)?$/, '?$1')
    .trim();
}

export function fillDisplayQuestionAnswer(text: string, answer: string | number): string {
  const answerText = String(answer);
  const trimmed = text.trim();

  if (trimmed.includes('?')) {
    return trimmed.replace('?', answerText);
  }

  return `${cleanDisplayQuestion(trimmed)} = ${answerText}`;
}
