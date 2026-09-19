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
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { GameTopBar, GameTopBarProps } from '../../components/GameTopBar';
import { useOverflowLayout } from '../../hooks/useOverflowLayout';
import { useResponsiveMenuScale } from '../../hooks/useResponsiveMenuScale';
import { selectModalCount } from '../../store/slices/modalSlice';
import type { RootState } from '../../store/store';
import '../../styles/global.scss';
import './GameScreenWrapper.scss';

export interface GameTimerConfig {
  durationSeconds: number;
  resetKey: string | number;
  paused?: boolean;
  onExpire?: () => void;
  remainingOverride?: number;
}

interface GameScreenWrapperProps {
  topBarProps: Omit<GameTopBarProps, 'onBack' | 'timer' | 'answeredCount'>;
  children: React.ReactNode;
  onBack: () => void;
  maxWidth?: number;
  timer?: GameTimerConfig;
  canvasGame?: boolean;
}

export const GameScreenWrapper: React.FC<GameScreenWrapperProps> = ({
  topBarProps,
  children,
  onBack,
  maxWidth = 1160,
  timer,
  canvasGame,
}) => {
  const { containerRef, overflows } = useOverflowLayout();
  const gameScale = useResponsiveMenuScale();

  const grade = useSelector((state: RootState) => state.gameSession.selectedGrade);
  const modalCount = useSelector(selectModalCount);

  const timerPaused = timer?.paused ?? false;
  const modalActive = modalCount > 0;

  const prevModalActiveRef = useRef(modalActive);
  const wasTimerCountingRef = useRef(!timerPaused);
  const [pauseToast, setPauseToast] = useState<{ message: string; id: number } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef(0);

  useEffect(() => {
    const was = prevModalActiveRef.current;
    const is = modalActive;
    prevModalActiveRef.current = is;

    const wasCounting = wasTimerCountingRef.current;
    wasTimerCountingRef.current = !timerPaused;

    if (was === is) return;

    const isPausing = is && wasCounting;
    const isResuming = !is && !timerPaused;
    if (!isPausing && !isResuming) return;

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    const id = ++toastIdRef.current;
    setPauseToast({ message: is ? 'Timer paused' : 'Timer resumed', id });
    setToastVisible(true);

    fadeTimerRef.current = setTimeout(() => setToastVisible(false), 2500);
    toastTimerRef.current = setTimeout(() => setPauseToast(null), 3000);

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };

  }, [modalActive, timerPaused]);

  const mw = `${maxWidth}px`;
  const useScrollableLayout = !canvasGame && overflows && gameScale >= 0.99;
  const scaleStyle = {
    '--game-scale': gameScale,
    '--game-shell-width': mw,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`${'gameScreenLayout'} ${canvasGame ? 'gameScreenWrapper-canvasRoot' : ''} ${useScrollableLayout ? 'gameScreenLayoutScroll' : ''}`}
    >
      <div className={`${'gameScreenWrapper-gameScaleFrame'} ${canvasGame ? 'gameScreenWrapper-gameScaleFrameCanvas' : ''}`} style={scaleStyle}>
        <GameTopBar
          {...topBarProps}
          grade={grade}
          onBack={onBack}
          timer={timer ? {
            durationSeconds: timer.durationSeconds,
            resetKey: timer.resetKey,
            paused: timerPaused,
            onExpire: timer.onExpire,
            remainingOverride: timer.remainingOverride,
          } : undefined}
        />

        <div className={`${'gameScreenWrapper-content'} ${canvasGame ? 'gameScreenWrapper-contentCanvas' : ''}`}>
          <div className={`${'gamePanel'} ${'gameScreenWrapper-gamePanelGame'} ${canvasGame ? 'gameScreenWrapper-gamePanelCanvas' : ''}`}>
            {children}
          </div>
        </div>

        <div className={`${'gameScreenWrapper-footer'} ${canvasGame ? 'gameScreenWrapper-footerCanvas' : ''}`} />
      </div>

      {pauseToast && createPortal(
        <div
          key={pauseToast.id}
          className={`${'gameScreenWrapper-timerPauseToast'} ${toastVisible ? 'gameScreenWrapper-toastVisible' : 'gameScreenWrapper-toastHidden'}`}
          role="status"
          aria-live="polite"
        >
          {pauseToast.message}
        </div>,
        document.body,
      )}
    </div>
  );
};
