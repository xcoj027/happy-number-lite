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
import React, { useState } from 'react';
import { HelpCircle, Play } from 'lucide-react';
import { GradeSelectDropdown } from '../../components/GradeSelectDropdown';
import { Topbar } from '../../components/Topbar';
import { HelpPopup } from '../../components/HelpPopup';
import { useGameApplication } from '../../useGameApplication';
import { useResponsiveMenuScale } from '../../hooks/useResponsiveMenuScale';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { setGameConfig } from '../../store/slices/gameSessionSlice';
import type { GameMode } from '../../components/GameModeSelector';
import type { GradeLevel } from '../../types/game.types';
import '../../styles/global.scss';
import './HomePage.scss';

const GAME_OPTIONS: { id: GameMode; label: string; color: string }[] = [
  { id: 'multichoice', label: 'Quiz', color: '#5ee7ff' },
  { id: 'carracing', label: 'Racing', color: '#ffb340' },
  { id: 'tugofwar', label: 'Tug of War', color: '#7ee787' },
];

export function HomePage() {
  const { selectedGrade, selectGameType } = useGameApplication();
  const selectedGameType = useSelector((state: RootState) => state.gameSession.selectedGameType);
  const dispatch = useDispatch<AppDispatch>();
  const menuScale = useResponsiveMenuScale();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={'homePage-page'}>
      <Topbar showBackButton={false} />

      <div
        className={'menuScaleFrame homePage-scaleFrame'}
        style={{
          '--menu-scale': menuScale,
          '--menu-unscale': 1 / menuScale,
        } as React.CSSProperties}
      >
        <div className={'homePage-centerContent'}>
          <div className={'homePage-brandPop'}>
            <h1 className={'homePage-stickerTitle'}>Happy Number</h1>
          </div>

          <div className={'homePage-gameRow'}>
            {GAME_OPTIONS.map((game) => {
              const isActive = selectedGameType === game.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  className={`${'homePage-gameCard'} ${isActive ? 'homePage-gameCardActive' : ''}`}
                  style={{ '--game-color': game.color } as React.CSSProperties}
                  onClick={() => dispatch(setGameConfig({ selectedGameType: game.id }))}
                >
                  <span className={'homePage-gameName'}>{game.label}</span>
                </button>
              );
            })}
          </div>

          <GradeSelectDropdown
            selectedGrade={selectedGrade}
            onSelectGrade={(grade) => dispatch(setGameConfig({ selectedGrade: grade as Exclude<GradeLevel, null> }))}
          />

          <button
            type="button"
            className={'homePage-playBtn'}
            onClick={() => selectGameType(selectedGameType)}
          >
            <span>Play</span>
            <Play size={20} fill="currentColor" aria-hidden="true" />
          </button>

          <button className={'homePage-helpLink'} onClick={() => setShowHelp(true)}>
            <HelpCircle size={16} />
            <span>How to play</span>
          </button>
        </div>
      </div>

      <HelpPopup isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
