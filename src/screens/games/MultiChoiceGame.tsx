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
import { useSelector } from 'react-redux';
import { Question, GeneratedQuiz, CompletedLevel, GradeLevel } from '../../types/game.types';
import { QuestionCard, ScoreChangeIndicator } from '../../components';
import { GameScreenWrapper, GameTimerConfig } from './GameScreenWrapper';
import { getGradeText } from '../../utils/grade.utils';
import { selectModalCount } from '../../store/slices/modalSlice';
import '../../styles/game-shared.scss';



interface SoloProps {
  playerName: string;
  level: number;
  score: number;
  question: Question;
  quizQuestion?: GeneratedQuiz | null;
  selectedAnswer: number | null;
  showFeedback: boolean;
  feedbackMessage: string;
  timeLeft: number;
  timerActive: boolean;
  isTimeout: boolean;
  completedLevels: CompletedLevel[];
  grade: GradeLevel;
  onAnswer: (answer: number) => void;
  onWrongAnswer?: () => void;
  onPauseTimer?: () => void;
  onResumeTimer?: () => void;
  onBack: () => void;
}



export const MultiChoiceGame: React.FC<SoloProps> = (props) => {
  const [scoreChange, setScoreChange] = React.useState<number | null>(null);
  const prevScoreRef = React.useRef(0);

  const modalCount   = useSelector(selectModalCount);



  React.useEffect(() => {
    if (props.showFeedback && props.score !== prevScoreRef.current) {
      setScoreChange(props.score - prevScoreRef.current);
      prevScoreRef.current = props.score;
    }
  }, [props.score, props.showFeedback]);



  const quizAnswerLabels = props.quizQuestion
    ? (props.quizQuestion.answers_en ?? props.quizQuestion.answers)
    : undefined;
  const quizExplanation = props.quizQuestion
    ? (props.quizQuestion.explanation_en ?? props.quizQuestion.explanation)
    : undefined;
  const displayFeedback = quizExplanation && props.feedbackMessage ? `${props.feedbackMessage} — ${quizExplanation}` : props.feedbackMessage;



  const currentScore = props.score;
  const gradeLabel = getGradeText(props.grade);
  const modeLabel = `Question ${props.level}/12`;


  const soloExtra = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="hidden md:flex items-center px-3 py-1.5 rounded-full text-sm"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--b-divider)', color: 'var(--t-primary)' }}>
        {gradeLabel}
      </div>
      <div className="relative flex items-center px-3 py-1.5 rounded-full text-sm"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--b-divider)', color: 'var(--t-primary)' }}>
        <span>Score: <span style={{ fontWeight: 700 }}>{currentScore}</span></span>
        {scoreChange !== null && (
          <ScoreChangeIndicator change={scoreChange} onComplete={() => setScoreChange(null)} />
        )}
      </div>
    </div>
  );



  const questionCard = (
    <QuestionCard
      num1={props.question.num1}
      num2={props.question.num2}
      operation={props.question.operation}
      timeLeft={props.timeLeft}
      timerActive={props.timerActive}
      questionNumber={props.level}
      showQuestionNumber={true}
      showFeedback={props.showFeedback}
      isWrongAnswer={props.showFeedback && props.selectedAnswer !== null && props.selectedAnswer !== props.question.correctAnswer && !props.isTimeout}
      isTimeout={props.isTimeout}
      completedLevels={props.completedLevels}
      totalQuestions={12}
      feedbackMessage={displayFeedback}
      isCorrect={props.selectedAnswer === props.question.correctAnswer}
      quizData={props.quizQuestion ?? undefined}
      answers={props.question.answers}
      labels={quizAnswerLabels ?? props.question.answers.map(String)}
      questionText={props.quizQuestion?.questionText}
      correctAnswer={props.question.correctAnswer}
      selectedAnswer={props.selectedAnswer}
      onAnswer={props.onAnswer}
      onWrongAnswer={props.onWrongAnswer}
      onPauseTimer={props.onPauseTimer}
      onResumeTimer={props.onResumeTimer}
    />
  );



  const questionResetKey = props.level;
  const timerConfig: GameTimerConfig = {
    durationSeconds:   20,
    resetKey:          questionResetKey,
    paused:            !props.timerActive || props.showFeedback || modalCount > 0,
    onExpire:          undefined,
    remainingOverride: props.timeLeft,
  };



  return (
    <GameScreenWrapper
      topBarProps={{
        modeLabel,
        score: currentScore,
        extra: soloExtra,
      }}
      onBack={props.onBack}
      timer={timerConfig}
    >
      <div className={'stageWrap'}>
        <div className={'scaleWrap'}>
          <div className="w-full">{questionCard}</div>
        </div>
      </div>
    </GameScreenWrapper>
  );
};
