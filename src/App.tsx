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
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { store } from './store/store';
import GameApplication from './GameApplication';
import { HomePage } from './pages/game/HomePage';
import { MultiChoiceGamePage } from './pages/game/MultiChoiceGamePage';
import { ResultPage } from './pages/game/ResultPage';
import { syncTestModeFromUrl } from './utils/testMode';
import './styles/global-theme.scss';
import './styles/base.scss';

syncTestModeFromUrl();

function WorkflowGuard({ children }: { children: React.ReactNode }) {
  const flowReady = useSelector((s: RootState) => s.gameSession.flowReady);
  if (!flowReady) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    syncTestModeFromUrl();
  }, [location.search, location.pathname]);

  return (
    <Routes>
      <Route element={<GameApplication />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<WorkflowGuard><MultiChoiceGamePage /></WorkflowGuard>} />
        <Route path="/result" element={<WorkflowGuard><ResultPage /></WorkflowGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}