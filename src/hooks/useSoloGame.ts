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
import { useState, useRef, useCallback, useEffect } from 'react';
import { Question, GeneratedQuiz, CompletedLevel, GradeLevel, AnsweredQuestion } from '../types/game.types';
import { QuizGeneratorFactory } from '../quiz/QuizGeneratorFactory';
import { GAME_CONFIG } from '../constants/game.constants';
import { useGamePauseEffect } from './useGamePause';
import { useSelector } from 'react-redux';
import { selectModalCount } from '../store/slices/modalSlice';

export const useSoloGame = () => {
  const modalCount = useSelector(selectModalCount);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [failureCount, setFailureCount] = useState<number>(0);
  const [question, setQuestion] = useState<Question | null>(null);


  const [quizQuestion, setQuizQuestion] = useState<GeneratedQuiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.timeLimit);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [completedLevels, setCompletedLevels] = useState<CompletedLevel[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [congratsText, setCongratsText] = useState<string>('');
  const [showWrongEffect, setShowWrongEffect] = useState<boolean>(false);
  const [playTimeSeconds, setPlayTimeSeconds] = useState<number>(0);
  const [questionHistory, setQuestionHistory] = useState<AnsweredQuestion[]>([]);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef<number>(GAME_CONFIG.timeLimit);


  const onTimeoutRef = useRef<(() => void) | null>(null);
  const questionRef = useRef<Question | null>(null);
  const quizQuestionRef = useRef<GeneratedQuiz | null>(null);
  const gradeRef = useRef<GradeLevel>(null);
  const gameStartTimeRef = useRef<number | null>(null);


  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startTimer = useCallback((onTimeout: () => void) => {

    if (modalCount > 0) return;

    onTimeoutRef.current = onTimeout;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timeLeftRef.current = GAME_CONFIG.timeLimit;
    setTimeLeft(GAME_CONFIG.timeLimit);

    setTimerActive(true);
    timerRef.current = setInterval(() => {

      const next = Math.max(0, timeLeftRef.current - 1);
      timeLeftRef.current = next;
      setTimeLeft(next);
      if (next <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        onTimeoutRef.current?.();
      }
    }, 1000);
  }, [modalCount]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);


  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

  }, []);


  const resumeTimer = useCallback(() => {
    if (timerRef.current || timeLeftRef.current <= 0) return;
    timerRef.current = setInterval(() => {
      const next = Math.max(0, timeLeftRef.current - 1);
      timeLeftRef.current = next;
      setTimeLeft(next);
      if (next <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        onTimeoutRef.current?.();
      }
    }, 1000);
  }, []);

  useGamePauseEffect(pauseTimer, resumeTimer);

  const generateNewQuestion = useCallback((grade: GradeLevel) => {
    gradeRef.current = grade;
    if (gameStartTimeRef.current === null) {
      gameStartTimeRef.current = Date.now();
    }





    const qq = QuizGeneratorFactory.create('math', grade).get();


    const arithmeticMatch = qq.questionText.match(/^(-?\d+)\s*([+−×÷])\s*(-?\d+)/);
    const adapted: Question = {
      num1: arithmeticMatch ? Number(arithmeticMatch[1]) : 0,
      num2: arithmeticMatch ? Number(arithmeticMatch[3]) : 0,
      operation: arithmeticMatch ? arithmeticMatch[2] : '',
      correctAnswer: qq.answers.indexOf(qq.correctAnswer),
      answers: qq.answers.map((_, i) => i),
    };
    setQuizQuestion(qq);
    quizQuestionRef.current = qq;
    setQuestion(adapted);
    questionRef.current = adapted;

    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsTimeout(false);

  }, []);

  const handleAnswer = useCallback((answer: number, isCorrect: boolean, celebrationText: string, feedbackMsg: string) => {
    if (showFeedback || isTimeout) return;
    stopTimer();
    const remainingSeconds = Math.ceil(timeLeftRef.current);
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setFeedbackMessage(feedbackMsg);
    if (isCorrect) {
      setCongratsText(celebrationText);
      setShowConfetti(true);
      setScore(prev => prev + remainingSeconds);
    } else {
      setShowWrongEffect(true);
      setFailureCount(prev => prev + 1);
    }

    if (questionRef.current) {
      const record: AnsweredQuestion = {
        level,
        num1: questionRef.current.num1,
        num2: questionRef.current.num2,
        operation: questionRef.current.operation,
        correctAnswer: questionRef.current.correctAnswer,
        selectedAnswer: answer,
        allAnswers: questionRef.current.answers,
        questionText: quizQuestionRef.current?.questionText,
        answerLabels: quizQuestionRef.current?.answers,
        explanation: quizQuestionRef.current?.explanation,
        topic: quizQuestionRef.current?.topic,
        isCorrect,
        isTimeout: false,
      };
      setQuestionHistory(prev => [...prev, record]);
    }
    setCompletedLevels(prev => [...prev, { level, success: isCorrect }]);
  }, [showFeedback, isTimeout, level, stopTimer]);



  const handleWrongBalloon = useCallback(() => {
    if (showFeedback || isTimeout) return;
    timeLeftRef.current = Math.max(0, timeLeftRef.current - 3);
    setTimeLeft(timeLeftRef.current);
    setFailureCount(prev => prev + 1);
    if (timeLeftRef.current <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onTimeoutRef.current?.();
    }
  }, [showFeedback, isTimeout]);

  const handleTimeout = useCallback((timeoutMsg: string) => {
    if (showFeedback || isTimeout) return;
    setIsTimeout(true);
    setShowFeedback(true);
    setFeedbackMessage(timeoutMsg);
    setFailureCount(prev => prev + 1);

    if (questionRef.current) {
      const record: AnsweredQuestion = {
        level,
        num1: questionRef.current.num1,
        num2: questionRef.current.num2,
        operation: questionRef.current.operation,
        correctAnswer: questionRef.current.correctAnswer,
        selectedAnswer: -1,
        allAnswers: questionRef.current.answers,
        questionText: quizQuestionRef.current?.questionText,
        answerLabels: quizQuestionRef.current?.answers,
        explanation: quizQuestionRef.current?.explanation,
        topic: quizQuestionRef.current?.topic,
        isCorrect: false,
        isTimeout: true,
      };
      setQuestionHistory(prev => [...prev, record]);
    }
    setCompletedLevels(prev => [...prev, { level, success: false }]);

  }, [showFeedback, isTimeout, level]);

  const nextLevel = useCallback(() => {
    setShowFeedback(false);
    setFeedbackMessage('');
    setSelectedAnswer(null);
    setShowConfetti(false);
    setCongratsText('');
    setShowWrongEffect(false);
    timeLeftRef.current = GAME_CONFIG.timeLimit;
    setTimeLeft(GAME_CONFIG.timeLimit);
    setTimerActive(false);
    setLevel(prev => prev + 1);
  }, []);

  const finalizePlayTime = useCallback(() => {
    if (gameStartTimeRef.current !== null) {
      const elapsed = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
      setPlayTimeSeconds(elapsed);
      gameStartTimeRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopTimer();
    setLevel(1);
    setScore(0);
    setFailureCount(0);
    setQuestion(null);
    setQuizQuestion(null);
    setQuestionHistory([]);
    questionRef.current = null;
    quizQuestionRef.current = null;
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedbackMessage('');
    timeLeftRef.current = GAME_CONFIG.timeLimit;
    setTimeLeft(GAME_CONFIG.timeLimit);
    setIsTimeout(false);
    setTimerActive(false);
    setCompletedLevels([]);
    setShowConfetti(false);
    setCongratsText('');
    setShowWrongEffect(false);
    setPlayTimeSeconds(0);
    gameStartTimeRef.current = null;
  }, [stopTimer]);

  return {
    questionHistory,
    level,
    score,
    failureCount,
    question,
    quizQuestion,
    selectedAnswer,
    showFeedback,
    feedbackMessage,
    timeLeft,
    isTimeout,
    completedLevels,
    showConfetti,
    congratsText,
    showWrongEffect,
    playTimeSeconds,
    generateNewQuestion,
    handleAnswer,
    handleWrongBalloon,
    timerActive,
    handleTimeout,
    nextLevel,
    reset,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    finalizePlayTime,
  };
};
