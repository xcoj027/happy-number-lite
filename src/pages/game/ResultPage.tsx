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
import { ResultScreen } from '../../screens';
import { useGameApplication } from '../../useGameApplication';

export function ResultPage() {
  const {
    selectedGameType,
    selectedGrade,
    playerName,
    soloGame,
    racingResult,
    towResult,
    handlePlayAgain,
  } = useGameApplication();

  if (selectedGameType === 'carracing' && racingResult) {
    const racingLevels = [
      ...Array(racingResult.correct).fill({ level: 1, success: true }),
      ...Array(Math.max(0, racingResult.wrong)).fill({ level: 1, success: false }),
    ];
    return (
      <ResultScreen
        mode="solo"
        isVictory={true}
        playerName={playerName}
        score={racingResult.score}
        completedLevels={racingLevels}
        questionHistory={[]}
        grade={selectedGrade}
        gameType="carracing"
        playTimeSeconds={90}
        onPlayAgain={() => handlePlayAgain('carracing')}
      />
    );
  }

  if (selectedGameType === 'tugofwar' && towResult) {
    const towLevels = [
      ...Array(towResult.correct).fill({ level: 1, success: true }),
      ...Array(Math.max(0, towResult.wrong)).fill({ level: 1, success: false }),
    ];
    return (
      <ResultScreen
        mode="solo"
        isVictory={towResult.win}
        playerName={playerName}
        score={towResult.score}
        completedLevels={towLevels}
        questionHistory={[]}
        grade={selectedGrade}
        gameType="tugofwar"
        onPlayAgain={() => handlePlayAgain('tugofwar')}
      />
    );
  }

  return (
    <ResultScreen
      mode="solo"
      isVictory={true}
      playerName={playerName}
      score={soloGame.score}
      completedLevels={soloGame.completedLevels}
      questionHistory={soloGame.questionHistory}
      grade={selectedGrade}
      gameType="multichoice"
      playTimeSeconds={soloGame.playTimeSeconds}
      onPlayAgain={() => handlePlayAgain('multichoice')}
    />
  );
}