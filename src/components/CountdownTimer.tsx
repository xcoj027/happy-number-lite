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
import './CountdownTimer.scss';

interface CountdownTimerProps {
  durationSeconds:    number;
  resetKey:           string | number;
  paused?:            boolean;
  onExpire?:          () => void;
  remainingOverride?: number;
}

interface PenaltyLabel {
  id:        number;
  amount:    number;
}

let penaltyIdCounter = 0;

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  durationSeconds,
  resetKey,
  paused = false,
  onExpire,
  remainingOverride,
}) => {
  const [remaining, setRemaining]         = useState(remainingOverride ?? durationSeconds);
  const [penalties, setPenalties]         = useState<PenaltyLabel[]>([]);
  const expiredRef                        = useRef(false);
  const onExpireRef                       = useRef(onExpire);
  const prevOverrideRef                   = useRef<number | undefined>(remainingOverride);
  onExpireRef.current = onExpire;


  useEffect(() => {
    setRemaining(remainingOverride ?? durationSeconds);
    expiredRef.current    = false;
    prevOverrideRef.current = remainingOverride;

  }, [resetKey, durationSeconds]);


  useEffect(() => {
    if (remainingOverride === undefined) return;

    const prev = prevOverrideRef.current;

    if (prev !== undefined && prev - remainingOverride >= 3) {
      const amount = prev - remainingOverride;
      const id     = ++penaltyIdCounter;
      setPenalties(ps => [...ps, { id, amount }]);

      setTimeout(() => {
        setPenalties(ps => ps.filter(p => p.id !== id));
      }, 900);
    }

    prevOverrideRef.current = remainingOverride;
    setRemaining(remainingOverride);

    if (remainingOverride <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current?.();
    }
  }, [remainingOverride]);


  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, resetKey, durationSeconds]);


  const isUrgent = durationSeconds > 0 && remaining > 0 && remaining / durationSeconds <= 0.15;

  const timerClass = [
    'countdownTimer-timer',
    isUrgent ? 'countdownTimer-timerUrgent' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={timerClass}
      role="timer"
      aria-label={`${remaining} seconds remaining`}
    >
      {penalties.map(p => (
        <span key={p.id} className={'countdownTimer-penaltyFloat'} aria-hidden="true">
          −{p.amount}s
        </span>
      ))}

      <span className={'countdownTimer-value'}>{remaining}</span>
    </div>
  );
};
