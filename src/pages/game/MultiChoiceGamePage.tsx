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
import type React from 'react';
import { Topbar } from '../../components/Topbar';
import { CarRacingGame, MultiChoiceGame, TugOfWarGame } from '../../screens/games';
import { useGameApplication } from '../../useGameApplication';
import '../../styles/global.scss';

export function MultiChoiceGamePage() {
  const {
    selectedGameType,
    selectedGrade,
    playerName,
    soloGame,
    backFromGame,
    handleSoloAnswer,
    handleGameFinish,
  } = useGameApplication();

  if (selectedGameType === 'carracing') {
    return <CarRacingGame key="carracing" grade={selectedGrade} playerName={playerName} onFinish={(r) => handleGameFinish('carracing', r)} onBack={backFromGame} />;
  }

  if (selectedGameType === 'tugofwar') {
    return <TugOfWarGame key="tugofwar" grade={selectedGrade} playerName={playerName} onFinish={(r) => handleGameFinish('tugofwar', r)} onBack={backFromGame} />;
  }

  if (soloGame.question) {
    return (
      <MultiChoiceGame
        playerName={playerName}
        level={soloGame.level}
        score={soloGame.score}
        question={soloGame.question}
        quizQuestion={soloGame.quizQuestion}
        selectedAnswer={soloGame.selectedAnswer}
        showFeedback={soloGame.showFeedback}
        feedbackMessage={soloGame.feedbackMessage}
        timeLeft={soloGame.timeLeft}
        timerActive={soloGame.timerActive}
        isTimeout={soloGame.isTimeout}
        completedLevels={soloGame.completedLevels}
        grade={selectedGrade}
        onAnswer={handleSoloAnswer}
        onWrongAnswer={soloGame.handleWrongBalloon}
        onBack={backFromGame}
        onPauseTimer={soloGame.pauseTimer}
        onResumeTimer={soloGame.resumeTimer}
      />
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className={`${'gamePanel'} ${'menuPagePanel'} p-6`}>
        <Topbar backTo="/" />
      </div>
    </div>
  );
}