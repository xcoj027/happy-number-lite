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
import { createContext, useContext } from 'react';
import type { RootState } from './store/store';
import type { GameMode } from './components/GameModeSelector';
import type {
  CarRacingGameResult,
  TugOfWarGameResult,
} from './screens/games';
import type { useSoloGame } from './hooks/useSoloGame';

type GradeValue = RootState['gameSession']['selectedGrade'];

export interface GameApplicationContextValue {
  selectedGrade: GradeValue;
  selectedGameType: GameMode;
  playerName: string;
  soloGame: ReturnType<typeof useSoloGame>;
  racingResult: CarRacingGameResult | null;
  towResult: TugOfWarGameResult | null;
  carScene: {
    carDelays: number[];
    carPositions: number[];
  };
  selectGrade: (grade: GradeValue | null) => void;
  selectGameType: (gameType: GameMode) => void;
  backToMenu: () => void;
  backFromGame: () => void;
  startSoloGame: () => void;
  handleSoloAnswer: (answer: number) => void;
  handlePlayAgain: (gameType: GameMode) => void;
  handleGameFinish:
    ((gameType: 'carracing', result: CarRacingGameResult) => void) &
    ((gameType: 'tugofwar', result: TugOfWarGameResult) => void);
}

export const GameApplicationContext = createContext<GameApplicationContextValue | null>(null);

export function useGameApplication() {
  const context = useContext(GameApplicationContext);
  if (!context) {
    throw new Error('useGameApplication must be used inside GameApplicationProvider');
  }
  return context;
}