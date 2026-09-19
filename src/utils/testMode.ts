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


export const TEST_MODE_LEVELS = 2;



if (localStorage.getItem('gameMode') !== null && localStorage.getItem('m_gameMode') === null) {
  localStorage.setItem('m_gameMode', localStorage.getItem('gameMode')!);
}
localStorage.removeItem('gameMode');

export const syncTestModeFromUrl = (): void => {
  const href = window.location.href;
  const queryStart = href.indexOf('?');
  if (queryStart === -1) {
    return;
  }
  const rawQuery = href.slice(queryStart).split('#')[0];
  const params = new URLSearchParams(rawQuery);
  const mode = params.get('mode');
  if (mode === 'test') {
    localStorage.setItem('m_gameMode', 'test');
  } else if (mode !== null) {
    localStorage.removeItem('m_gameMode');
  }
};

export const isTestMode = (): boolean =>
  localStorage.getItem('m_gameMode') === 'test';
