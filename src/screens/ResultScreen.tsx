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
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { Topbar } from '../components';
import { ResultIllustration } from '../components/ResultIllustration';
import { CompletedLevel, GradeLevel, AnsweredQuestion } from '../types/game.types';
import './ResultScreen.scss';
import '../styles/global.scss';

const RING_CIRCUMFERENCE = 2 * Math.PI * 37;

export interface ResultScreenProps {
  mode: 'solo';
  playerName: string;
  score: number;
  grade: GradeLevel;
  gameType?: 'multichoice' | 'carracing' | 'tugofwar';
  playTimeSeconds?: number;
  questionHistory?: AnsweredQuestion[];
  isVictory: boolean;
  completedLevels: CompletedLevel[];
  onPlayAgain: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  onPlayAgain,
  completedLevels,
}) => {
  const navigate = useNavigate();

  const backToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const correctCount = completedLevels.filter((item) => item.success).length;
  const wrongCount = completedLevels.filter((item) => !item.success).length;

  const rawScore = score;
  const displayScore = Math.max(0, rawScore);
  const totalAnswered = correctCount + wrongCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const performanceTier: 'great' | 'good' | 'practice' =
    accuracy >= 80 ? 'great' : accuracy >= 50 ? 'good' : 'practice';

  const praiseText =
    performanceTier === 'great'
      ? 'Awesome work!'
      : performanceTier === 'good'
        ? 'Nice job!'
        : 'Keep practicing!';

  return (
    <div className={'resultScreen-resultPage'}>
      <div aria-hidden="true" className={'resultScreen-bgSplash'} />

      <div className={'resultScreen-resultLayout'}>
        <div className={`${'gamePanel'} ${'menuPanel'} ${'menuPagePanel'} ${'resultScreen-resultPanel'} p-5 md:p-6`}>
          <div className={'resultScreen-resultTopbar'}>
            <Topbar showBackButton={true} backTo="/" onBack={backToHome} />
          </div>

          <div className={`${'resultScreen-victoryBanner'} ${`resultScreen-victoryBanner-${performanceTier}`}`} aria-label={praiseText}>
            <div className={'resultScreen-victoryBannerInner'}>
              <span className={'resultScreen-victoryBannerText'}>{praiseText}</span>
            </div>
          </div>

          <div className={'resultScreen-statsPanelBox'}>
            <div className={'resultScreen-statsPanel'}>
              <div className={'resultScreen-statBlock'}>
                <span className={'resultScreen-statLabel'}>Score</span>
                <span className={`${'resultScreen-scoreValue'} ${`resultScreen-score-${performanceTier}`}`}>
                  {displayScore.toLocaleString()}
                </span>
              </div>

              <div className={'resultScreen-statDivider'} aria-hidden="true" />

              <div className={'resultScreen-statBlock'}>
                <span className={'resultScreen-statLabel'}>Accuracy</span>
                <div className={'resultScreen-accuracyRing'}>
                  <svg className={'resultScreen-accuracyRingSvg'} viewBox="0 0 84 84">
                    <circle className={'resultScreen-accuracyRingTrack'} cx="42" cy="42" r="37" />
                    <circle
                      className={`${'resultScreen-accuracyRingFill'} ${`resultScreen-accuracyRingFill-${performanceTier}`}`}
                      cx="42"
                      cy="42"
                      r="37"
                      strokeDasharray={`${(accuracy / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                    />
                  </svg>
                  <span className={'resultScreen-accuracyRingValue'}>{accuracy}%</span>
                </div>
              </div>
            </div>
          </div>

          <ResultIllustration className={'resultScreen-resultIllustration'} />

          <div className={'resultScreen-actionButtons'}>
            <button
              type="button"
              className={`${'resultScreen-btnPlayAgain'} ${`resultScreen-btnPlayAgain-${performanceTier}`}`}
              onClick={onPlayAgain}
            >
              <RotateCcw size={20} strokeWidth={2.5} />
              <span>Play Again!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
