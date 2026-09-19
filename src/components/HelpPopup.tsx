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
import { InformationModal } from './InformationModal';
import './HelpPopup.scss';

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      label: 'MultiChoice',
      color: '#22d3ee',
      items: ['Answer 12 math questions. Each question has 20 seconds — pick the correct answer from choices. Answer fast for more points!'],
    },
    {
      label: 'Car Racing',
      color: '#ff7b4b',
      items: ['Drive through math obstacles! Your car carries a number — pass barriers with numbers BIGGER than yours to score (+10). Hitting a smaller number costs −5 points, and clovers give +2. 90 seconds — go as far as you can!'],
    },
    {
      label: 'Tug of War',
      color: '#f43f5e',
      items: ['Team battle! Split into Team A and Team B — the first correct answer pulls the rope. 6 pulls wins. 12 questions, no time limit, up to 5 players per team.'],
    },
    {
      label: 'Scoring Rules',
      color: '#fbbf24',
      items: [
        'Read the question carefully before choosing',
        'Answer quickly to get more points',
        'Solo mode: complete all 12 questions',
        'Arena mode: compete with friends!',
      ],
    },
  ];

  return (
    <InformationModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={600}
      title={'How to Play'}
    >
      <div className={'helpPopup-content'}>
        {sections.map(section => (
          <div key={section.label} className={'helpPopup-section'}>
            <p className={'helpPopup-sectionTitle'} style={{ color: section.color }}>
              {section.label}
            </p>
            <ul className={'helpPopup-list'}>
              {section.items.map((item, i) => (
                <li key={i} className={'helpPopup-listItem'}>
                  <span className={'helpPopup-bullet'} style={{ background: section.color }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button className={'helpPopup-closePrimary'} onClick={onClose}>
          OK
        </button>
      </div>
    </InformationModal>
  );
};
