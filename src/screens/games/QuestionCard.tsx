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
import { Player, CompletedLevel, GeneratedQuiz } from '../../types/game.types';
import './QuestionCard.scss';
import { GameCanvas } from '../../components/GameCanvas';
import { cleanDisplayQuestion } from '../../utils/questionDisplay';

interface QuestionCardProps {
  num1: number;
  num2: number;
  operation: string;
  timeLeft: number;
  timerActive?: boolean;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  showFeedback?: boolean;
  waitingForOthers?: boolean;
  waitingLabel?: string;
  waitingSpinner?: boolean;
  answeredAtSecond?: number;
  players?: Player[];
  isWrongAnswer?: boolean;
  isTimeout?: boolean;
  feedbackMessage?: string;
  isCorrect?: boolean;
  completedLevels?: CompletedLevel[];
  totalQuestions?: number;
  quizData?: GeneratedQuiz;

  answers?: number[];
  labels?: string[];
  correctAnswer?: number;
  selectedAnswer?: number | null;
  onAnswer?: (answer: number) => void;
  onWrongAnswer?: () => void;
  currentScore?: number;
  currentPointValue?: number;
  reviewSeconds?: number | null;
  statusText?: string;
  explanation?: string;

  children?: React.ReactNode;

  questionText?: string;

  onPauseTimer?: () => void;

  onResumeTimer?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = React.memo(({
  num1, num2, operation, timeLeft, timerActive = true,
  questionNumber, showFeedback = false, waitingForOthers = false, waitingLabel, waitingSpinner = false,
  players = [],
  isTimeout = false,
  completedLevels = [], totalQuestions = 12, quizData,
  answers = [], labels, correctAnswer = 0, selectedAnswer = null,
  onAnswer = () => {}, onWrongAnswer,
  children,
  questionText,
}: QuestionCardProps) => {
  const answeredCount = players.filter(p => p.answered).length;
  const totalPlayers  = players.length;
  const answeredLabel = `${answeredCount}/${totalPlayers} players answered`;
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, [num1, num2, operation, questionNumber, quizData]);

  const quizText = quizData
    ? (quizData.questionText_en ?? quizData.questionText)
    : '';

  const aiQuestion = questionText
    ?? (quizData ? cleanDisplayQuestion(quizText) : `${num1} ${operation} ${num2}`);

  return (
    <div
      className={'questionCard-root'}
      style={{ minHeight: 'min(80vh, 660px)' }}
    >
      <div className={'questionCard-questionBox'}>
        <p className={`questionText questionCard-questionText${quizData ? ' questionCard-questionTextQuiz' : ''}`}>{aiQuestion}</p>
      </div>

      <div className={'questionCard-canvasArea'}>
        <GameCanvas
          questionNumber={questionNumber ?? 1}
          totalQuestions={totalQuestions}
          animKey={key}
          timeLeft={timeLeft}
          timerActive={timerActive}
          answersDisabled={false}
          answers={answers}
          labels={labels}
          correctAnswer={correctAnswer}
          showFeedback={showFeedback}
          selectedAnswer={selectedAnswer}
          isTimeout={isTimeout}
          completedLevels={completedLevels}
          onAnswer={onAnswer}
          onWrongAnswer={onWrongAnswer}
        />
      </div>

        {}
        {children && (
          <div className="absolute inset-0 z-20" style={{ pointerEvents: 'none' }}>
            {children}
          </div>
        )}

        {}
        {waitingForOthers && (
          <div className={'questionCard-waitingBanner'}>
            {waitingSpinner && <span className={'questionCard-waitingSpinner'} aria-hidden="true" />}
            <span className={'questionCard-waitingText'}>
              {waitingLabel ?? (totalPlayers > 0 ? answeredLabel : 'Waiting for others...')}
            </span>
          </div>
        )}
    </div>
  );
});
