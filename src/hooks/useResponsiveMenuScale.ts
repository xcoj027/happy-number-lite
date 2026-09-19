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
import { useEffect, useState } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeMenuScale(width: number, height: number) {
  if (width <= 600) return 1;
  if (width > 1360 && height > 760) return 1;

  const widthScale = width / 1480;
  const heightScale = height / 820;
  return clamp(Math.min(widthScale, heightScale), 0.78, 0.92);
}

function computeModalScale(width: number, height: number) {
  if (width <= 600) return 1;
  if (width > 1360 && height > 760) return 1;


  const widthScale = width / 1560;
  const heightScale = height / 860;
  return clamp(Math.min(widthScale, heightScale), 0.78, 0.9);
}

export function useResponsiveMenuScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      setScale(computeMenuScale(window.innerWidth, window.innerHeight));
    };

    update();
    const onResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return scale;
}

export function useResponsiveModalScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      setScale(computeModalScale(window.innerWidth, window.innerHeight));
    };

    update();
    const onResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return scale;
}
