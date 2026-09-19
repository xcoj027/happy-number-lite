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
import { Outlet, useLocation } from 'react-router-dom';
import { BackgroundWrapper, PageTransition } from './components';
import { GameApplicationProvider } from './GameApplicationContext';
import { useGameApplication } from './useGameApplication';

function GameApplicationShell() {
  const location = useLocation();
  const { carScene } = useGameApplication();
  const transitionKey = location.pathname;

  return (
    <BackgroundWrapper
      carDelays={carScene.carDelays}
      carPositions={carScene.carPositions}
      transitionKey={transitionKey}
    >
      <PageTransition transitionKey={transitionKey}>
        <Outlet />
      </PageTransition>
    </BackgroundWrapper>
  );
}

export default function GameApplication() {
  return (
    <GameApplicationProvider>
      <GameApplicationShell />
    </GameApplicationProvider>
  );
}
