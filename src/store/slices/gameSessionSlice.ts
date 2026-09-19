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
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameMode as MiniGameMode } from '../../components/GameModeSelector';
import type { GradeLevel } from '../../types/game.types';

export type GradeValue = Exclude<GradeLevel, null>;
export type GameConfigPatch = Partial<Pick<GameSessionState, 'selectedGrade' | 'selectedGameType'>>;

interface GameSessionState {
  selectedGrade: GradeValue;
  selectedGameType: MiniGameMode;
  playerName: string;
  totalScore: number;
  flowReady: boolean;
}

const PLAYER_NAME_KEY = 'm_playerName';
const GRADE_KEY = 'm_selectedGrade';
const GAME_TYPE_KEY = 'm_selectedGameType';

const VALID_GAME_TYPES = ['multichoice', 'carracing', 'tugofwar'] as const;
const VALID_GRADES = [1, 2, 3, 4, 5, 'multiplicationTable'] as const;

function loadGrade(): GradeValue {
  const raw = localStorage.getItem(GRADE_KEY);
  if (raw === 'multiplicationTable') return raw;
  const num = Number(raw);
  return (VALID_GRADES as ReadonlyArray<GradeValue>).includes(num as GradeValue) ? num as GradeValue : 2;
}

function loadGameType(): MiniGameMode {
  const raw = localStorage.getItem(GAME_TYPE_KEY);
  return (VALID_GAME_TYPES as ReadonlyArray<string>).includes(raw as string)
    ? (raw as MiniGameMode)
    : 'multichoice';
}

if (localStorage.getItem('playerName') !== null && localStorage.getItem(PLAYER_NAME_KEY) === null) {
  localStorage.setItem(PLAYER_NAME_KEY, localStorage.getItem('playerName')!);
}
localStorage.removeItem('playerName');

const initialState: GameSessionState = {
  selectedGrade: loadGrade(),
  selectedGameType: loadGameType(),
  playerName: localStorage.getItem(PLAYER_NAME_KEY)?.trim() || '',
  totalScore: 0,
  flowReady: false,
};

export const gameSessionSlice = createSlice({
  name: 'gameSession',
  initialState,
  reducers: {
    backToMenuSession: (state) => {
      state.selectedGameType = 'multichoice';
      state.totalScore = 0;
      state.flowReady = false;
    },

    setFlowReady: (state) => {
      state.flowReady = true;
    },

    setGameConfig: (state, action: PayloadAction<GameConfigPatch>) => {
      const { selectedGrade, selectedGameType } = action.payload;
      if (selectedGrade !== undefined) {
        state.selectedGrade = selectedGrade;
        localStorage.setItem(GRADE_KEY, String(selectedGrade));
      }
      if (selectedGameType !== undefined) {
        state.selectedGameType = selectedGameType;
        localStorage.setItem(GAME_TYPE_KEY, selectedGameType);
      }
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
      if (action.payload.trim()) {
        localStorage.setItem(PLAYER_NAME_KEY, action.payload);
      }
    },

    setTotalScore: (state, action: PayloadAction<number>) => {
      state.totalScore = action.payload;
    },
    resetTotalScore: (state) => {
      state.totalScore = 0;
    },
  },
});

export const {
  backToMenuSession,
  setFlowReady,
  setGameConfig,
  setPlayerName,
  setTotalScore,
  resetTotalScore,
} = gameSessionSlice.actions;

export default gameSessionSlice.reducer;
