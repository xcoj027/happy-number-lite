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
import React from 'react';
import { getTransitionsEnabled } from '../utils/transitions';
import './PageTransition.scss';

interface PageTransitionProps {
  transitionKey: string;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ transitionKey, children }) => {
  const animated = getTransitionsEnabled();

  return (
    <div className={'pageTransition-container'}>
      <div
        key={transitionKey}
        className={`${'pageTransition-slot'} ${animated ? 'pageTransition-slotEnter' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};
