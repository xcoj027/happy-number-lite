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
import { useRef, useState, useEffect, useCallback } from 'react';

export const useOverflowLayout = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  const check = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const prev = el.style.position;
    el.style.position = 'relative';
    const naturalHeight = el.scrollHeight;
    el.style.position = prev;
    setOverflows(naturalHeight > window.innerHeight);
  }, []);

  useEffect(() => {

    const timer = setTimeout(check, 50);
    window.addEventListener('resize', check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', check);
    };
  }, [check]);


  return { containerRef, overflows, recheck: check };
};
