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

import React, { useEffect, useRef, useState } from 'react';
import { getGradeText } from '../utils/grade.utils';
import { GradeLevel } from '../types/game.types';
import { CountdownTimer } from './CountdownTimer';
import './GameTopBar.scss';
import '../styles/global.scss';

export interface GameTopBarProps {
  modeLabel:     string;
  score?:        number;
  grade?:        GradeLevel;
  onBack:        () => void;
  extra?:        React.ReactNode;
  aiExtra?:      React.ReactNode;
  timer?: {
    durationSeconds: number;
    resetKey: string | number;
    paused?: boolean;
    onExpire?: () => void;
    remainingOverride?: number;
  };
  answeredCount?: { answered: number; total: number };
}

interface ScoreFly { id: number; delta: number; }

export const GameTopBar: React.FC<GameTopBarProps> = ({
  score, grade, onBack, timer, answeredCount,
}) => {
  const gradeLabel = grade != null ? getGradeText(grade) : null;
  const prevScoreRef = useRef<number | null>(null);
  const flyIdRef = useRef(0);
  const [flies, setFlies] = useState<ScoreFly[]>([]);

  useEffect(() => {
    if (score === undefined) {
      prevScoreRef.current = null;
      return;
    }
    if (prevScoreRef.current === null) { prevScoreRef.current = score; return; }
    const delta = score - prevScoreRef.current;
    prevScoreRef.current = score;
    if (delta === 0) return;
    const id = ++flyIdRef.current;
    setFlies(f => [...f, { id, delta }]);
    setTimeout(() => setFlies(f => f.filter(x => x.id !== id)), 900);
  }, [score]);

  const metrics = (
    <>
      {answeredCount != null && (
        <span className={'gameTopBar-answeredPill'}>
          <span className={'gameTopBar-answeredValue'}>{answeredCount.answered}</span>
          <span className={'gameTopBar-answeredSep'}>/</span>
          <span className={'gameTopBar-answeredTotal'}>{answeredCount.total}</span>
        </span>
      )}
      {timer != null && (
        <CountdownTimer
          durationSeconds={timer.durationSeconds}
          resetKey={timer.resetKey}
          paused={timer.paused}
          onExpire={timer.onExpire}
          remainingOverride={timer.remainingOverride}
        />
      )}
      <span className={'gameTopBar-gradePill'}>{gradeLabel}</span>
      {score !== undefined && (
        <div className={'gameTopBar-scorePill'}>
          <span className={'gameTopBar-scoreLabel'}>Score</span>
          <span
            className={'gameTopBar-scoreValue'}
            data-negative={score < 0 ? 'true' : undefined}
          >{score}</span>
          {flies.map(fly => (
            <span
              key={fly.id}
              className={`${'gameTopBar-scoreFly'} ${fly.delta > 0 ? 'gameTopBar-scoreFlyGain' : 'gameTopBar-scoreFlyLoss'}`}
            >
              {fly.delta > 0 ? `+${fly.delta}` : fly.delta}
            </span>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className={'gameTopbar'}>
      <div className={'gameTopBar-inner'}>
        <div className={'gameTopBar-leftCluster'}>
          <button className={'gameTopBar-backBtn'} onClick={onBack} aria-label="Back">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className={'gameTopBar-metricsCluster'}>
          {metrics}
        </div>

      </div>
    </div>
  );
};
