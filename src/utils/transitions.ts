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


const STORAGE_KEY  = 'm_pageTransitionsEnabled';
const LEGACY_KEY   = 'pageTransitionsEnabled';


if (localStorage.getItem(LEGACY_KEY) !== null && localStorage.getItem(STORAGE_KEY) === null) {
  localStorage.setItem(STORAGE_KEY, localStorage.getItem(LEGACY_KEY)!);
}
localStorage.removeItem(LEGACY_KEY);

let transitionsEnabled: boolean = (() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === 'true';
})();

export const getTransitionsEnabled = (): boolean => transitionsEnabled;

export const setTransitionsEnabled = (enabled: boolean): void => {
  transitionsEnabled = enabled;
  localStorage.setItem(STORAGE_KEY, String(enabled));
};
