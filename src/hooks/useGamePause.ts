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
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectModalCount } from '../store/slices/modalSlice';

export function useGamePause() {
  const modalCount = useSelector(selectModalCount);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = modalCount > 0;
  }, [modalCount]);

  return pausedRef;
}

export function useGamePauseEffect(pause: () => void, resume: () => void) {
  const modalCount = useSelector(selectModalCount);
  const prevRef = useRef(modalCount);

  useEffect(() => {
    if (modalCount > 0 && prevRef.current === 0) {
      pause();
    } else if (modalCount === 0 && prevRef.current > 0) {
      resume();
    }
    prevRef.current = modalCount;
  }, [modalCount, pause, resume]);
}
