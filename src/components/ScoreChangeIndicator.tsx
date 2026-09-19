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
import React, { useEffect } from 'react';
import './ScoreChangeIndicator.scss';

interface ScoreChangeIndicatorProps {
  change: number;
  onComplete: () => void;
}

const ScoreChangeIndicatorComponent: React.FC<ScoreChangeIndicatorProps> = ({ change, onComplete }) => {
  const isPositive = change > 0;

  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`${'scoreChangeIndicator-indicator'} ${isPositive ? 'scoreChangeIndicator-indicator--positive' : 'scoreChangeIndicator-indicator--negative'} absolute font-bold text-2xl pointer-events-none z-50 ${
        isPositive
          ? 'text-green-600 animate-scoreUp'
          : 'text-red-600 animate-scoreDown'
      }`}
    >
      <b>{isPositive ? '+' : ''}{change}</b>
    </div>
  );
};

export const ScoreChangeIndicator = React.memo(ScoreChangeIndicatorComponent);
