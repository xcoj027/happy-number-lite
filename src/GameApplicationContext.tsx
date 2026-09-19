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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSoloGame } from './hooks/useSoloGame';
import {
  backToMenuSession,
  setFlowReady,
  setGameConfig,
} from './store/slices/gameSessionSlice';
import type { AppDispatch, RootState } from './store/store';
import type { GameMode } from './components/GameModeSelector';
import type { CarRacingGameResult, TugOfWarGameResult } from './screens/games';
import { CELEBRATION_TEXTS, CORRECT_MESSAGES, TIMEOUT_MESSAGES, WRONG_MESSAGES } from './constants/game.constants';
import { getRandomMessage } from './utils/game.utils';
import { isTestMode, TEST_MODE_LEVELS } from './utils/testMode';
import {
  GameApplicationContext,
  type GameApplicationContextValue,
} from './useGameApplication';

type GradeValue = RootState['gameSession']['selectedGrade'];

const VALID_GRADES: GradeValue[] = [1, 2, 3, 4, 5, 'multiplicationTable'];
const VALID_GAME_TYPES: GameMode[] = ['multichoice', 'carracing', 'tugofwar'];
const WORKFLOW_ROUTES = new Set(['/play', '/result']);

function parseGrade(value: string | null): GradeValue | null {
  if (!value) return null;
  if (value === 'multiplicationTable') return value;
  const numeric = Number(value);
  return VALID_GRADES.includes(numeric as GradeValue) ? numeric as GradeValue : null;
}

function parseGameType(value: string | null): GameMode | null {
  return VALID_GAME_TYPES.includes(value as GameMode) ? value as GameMode : null;
}

export function GameApplicationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const selectedGrade = useSelector((state: RootState) => state.gameSession.selectedGrade);
  const selectedGameType = useSelector((state: RootState) => state.gameSession.selectedGameType);

  const [racingResult, setRacingResult] = useState<CarRacingGameResult | null>(null);
  const [towResult, setTowResult] = useState<TugOfWarGameResult | null>(null);
  const [carDelays] = useState<number[]>([-1, -3, -5]);
  const [carPositions] = useState<number[]>([
    20 + Math.random() * 20,
    50 + Math.random() * 20,
    80 + Math.random() * 20,
  ]);

  const soloGame = useSoloGame();

  const updateGameConfig = useCallback((config: {
    selectedGrade?: GradeValue;
    selectedGameType?: GameMode;
  }) => {
    dispatch(setGameConfig(config));
  }, [dispatch]);

  const resetResultState = useCallback(() => {
    setRacingResult(null);
    setTowResult(null);
  }, []);

  const backToMenu = useCallback(() => {
    soloGame.reset();
    resetResultState();
    dispatch(backToMenuSession());
    navigate('/');
  }, [dispatch, navigate, resetResultState, soloGame]);

  const backFromGame = useCallback(() => {
    soloGame.reset();
    resetResultState();
    navigate('/');
  }, [navigate, resetResultState, soloGame]);

  const pendingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearPendingTimers = useCallback(() => {
    pendingTimersRef.current.forEach((handle) => clearTimeout(handle));
    pendingTimersRef.current = [];
  }, []);
  const schedulePendingTimer = useCallback((fn: () => void, delay: number) => {
    const handle = setTimeout(fn, delay);
    pendingTimersRef.current.push(handle);
    return handle;
  }, []);

  const makeTimeoutHandler = useCallback((currentGrade: GradeValue, levelForThisQuestion: number) => () => {
    soloGame.handleTimeout(getRandomMessage(TIMEOUT_MESSAGES));
    schedulePendingTimer(() => {
      const totalLevels = isTestMode() ? TEST_MODE_LEVELS : 12;
      if (levelForThisQuestion < totalLevels) {
        soloGame.nextLevel();
        soloGame.generateNewQuestion(currentGrade);
        const nextLevel = levelForThisQuestion + 1;
        schedulePendingTimer(() => soloGame.startTimer(makeTimeoutHandler(currentGrade, nextLevel)), 2000);
      } else {
        soloGame.finalizePlayTime();
        navigate('/result');
      }
    }, 2000);
  }, [navigate, schedulePendingTimer, soloGame]);

  const startSoloGame = useCallback((gameType: GameMode = selectedGameType) => {
    clearPendingTimers();
    dispatch(setFlowReady());
    soloGame.reset();
    updateGameConfig({ selectedGameType: gameType });
    navigate('/play');
    soloGame.generateNewQuestion(selectedGrade);
    schedulePendingTimer(() => soloGame.startTimer(makeTimeoutHandler(selectedGrade, 1)), 0);
  }, [clearPendingTimers, dispatch, makeTimeoutHandler, navigate, schedulePendingTimer, selectedGameType, selectedGrade, soloGame, updateGameConfig]);

  const handleSoloAnswer = useCallback((answer: number) => {
    if (!soloGame.question) return;
    const noScore = answer === -1;
    const effectiveAnswer = noScore ? soloGame.question.correctAnswer : answer;
    const isCorrect = noScore ? false : (answer === soloGame.question.correctAnswer);
    soloGame.handleAnswer(
      effectiveAnswer,
      isCorrect,
      getRandomMessage(CELEBRATION_TEXTS),
      getRandomMessage(isCorrect ? CORRECT_MESSAGES : WRONG_MESSAGES),
    );
    schedulePendingTimer(() => {
      const totalLevels = isTestMode() ? TEST_MODE_LEVELS : 12;
      if (soloGame.level < totalLevels) {
        const nextLvl = soloGame.level + 1;
        soloGame.nextLevel();
        soloGame.generateNewQuestion(selectedGrade);
        schedulePendingTimer(() => soloGame.startTimer(makeTimeoutHandler(selectedGrade, nextLvl)), 2000);
      } else {
        soloGame.finalizePlayTime();
        navigate('/result');
      }
    }, 2000);
  }, [makeTimeoutHandler, navigate, schedulePendingTimer, selectedGrade, soloGame]);

  const selectGrade = useCallback((nextGrade: GradeValue | null) => {
    if (nextGrade !== null) updateGameConfig({ selectedGrade: nextGrade });
  }, [updateGameConfig]);

  const selectGameType = useCallback((gameType: GameMode) => {
    updateGameConfig({ selectedGameType: gameType });
    resetResultState();
    dispatch(setFlowReady());
    if (gameType === 'multichoice') {
      startSoloGame(gameType);
    } else {
      navigate('/play');
    }
  }, [dispatch, navigate, resetResultState, startSoloGame, updateGameConfig]);

  const handlePlayAgain = useCallback((gameType: GameMode) => {
    resetResultState();
    if (gameType === 'multichoice') {
      startSoloGame(gameType);
      return;
    }
    updateGameConfig({ selectedGameType: gameType });
    navigate('/play');
  }, [navigate, resetResultState, startSoloGame, updateGameConfig]);

  const handleGameFinish = useCallback((
    gameType: 'carracing' | 'tugofwar',
    result: CarRacingGameResult | TugOfWarGameResult,
  ) => {
    if (gameType === 'carracing') setRacingResult(result as CarRacingGameResult);
    else if (gameType === 'tugofwar') setTowResult(result as TugOfWarGameResult);
    navigate('/result');
  }, [navigate]) as GameApplicationContextValue['handleGameFinish'];

  const homeResetHandledRef = useRef(false);

  useEffect(() => {
    const isHome = location.pathname === '/' || location.pathname === '';
    if (!isHome) {
      homeResetHandledRef.current = false;
      return;
    }
    sessionStorage.setItem('flow_started', '1');
    dispatch(setFlowReady());
    if (homeResetHandledRef.current) return;
    homeResetHandledRef.current = true;
    dispatch(backToMenuSession());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const queryGrade = parseGrade(searchParams.get('selectedGrade') ?? searchParams.get('grade'));
    const queryGameType = parseGameType(searchParams.get('selectedGameType') ?? searchParams.get('gameType'));

    if (queryGrade) updateGameConfig({ selectedGrade: queryGrade });
    if (queryGameType) updateGameConfig({ selectedGameType: queryGameType });
  }, [location.search, searchParams, updateGameConfig]);

  useEffect(() => {
    const pathname = location.pathname;
    if (!WORKFLOW_ROUTES.has(pathname)) return;
    if (!selectedGameType) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate, selectedGameType]);

  const value = useMemo<GameApplicationContextValue>(() => ({
    selectedGrade,
    selectedGameType,
    playerName: '',
    soloGame,
    racingResult,
    towResult,
    carScene: {
      carDelays,
      carPositions,
    },
    selectGrade,
    selectGameType,
    backToMenu,
    backFromGame,
    startSoloGame,
    handleSoloAnswer,
    handlePlayAgain,
    handleGameFinish,
  }), [
    soloGame, selectedGrade, selectedGameType,
    racingResult, towResult,
    carDelays, carPositions,
    backFromGame, backToMenu,
    startSoloGame,
    selectGrade, selectGameType,
    handleSoloAnswer, handlePlayAgain, handleGameFinish,
  ]);

  return (
    <GameApplicationContext.Provider value={value}>
      {children}
    </GameApplicationContext.Provider>
  );
}