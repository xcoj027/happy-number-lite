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
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { GradeLevel } from '../types/game.types';
import './GradeSelectDropdown.scss';

interface GradeSelectDropdownProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
}

const GRADES: { value: GradeLevel; label: string }[] = [
  { value: 1, label: 'Grade 1' },
  { value: 2, label: 'Grade 2' },
  { value: 3, label: 'Grade 3' },
  { value: 4, label: 'Grade 4' },
  { value: 5, label: 'Grade 5' },
  { value: 'multiplicationTable', label: 'Multiplication Table' },
];

export const GradeSelectDropdown: React.FC<GradeSelectDropdownProps> = ({
  selectedGrade,
  onSelectGrade,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const currentIndex = Math.max(
    0,
    GRADES.findIndex((g) => g.value === (selectedGrade ?? 1)),
  );
  const current = GRADES[currentIndex] ?? GRADES[0];

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const commitSelection = (index: number) => {
    const grade = GRADES[index];
    if (!grade) return;
    onSelectGrade(grade.value);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, GRADES.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        commitSelection(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex]);

  return (
    <div className={'gradeSelectDropdown-wrap'} ref={rootRef}>
      <div className={'gradeSelectDropdown-field'}>
        <button
          type="button"
          className={`${'gradeSelectDropdown-trigger'} ${isOpen ? 'gradeSelectDropdown-triggerOpen' : ''}`}
          onClick={() => setIsOpen((v) => !v)}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Choose grade"
        >
          <span className={'gradeSelectDropdown-triggerText'}>{current.label}</span>
          <ChevronDown
            size={18}
            className={'gradeSelectDropdown-chevron'}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <ul
            className={'gradeSelectDropdown-menu'}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            aria-activedescendant={`grade-option-${activeIndex}`}
          >
            {GRADES.map((grade, index) => {
              const isSelected = grade.value === current.value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={String(grade.value)}
                  id={`grade-option-${index}`}
                  ref={(el) => { optionRefs.current[index] = el; }}
                  role="option"
                  aria-selected={isSelected}
                  className={`${'gradeSelectDropdown-option'} ${isSelected ? 'gradeSelectDropdown-optionSelected' : ''} ${isActive ? 'gradeSelectDropdown-optionActive' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commitSelection(index)}
                >
                  <span>{grade.label}</span>
                  {isSelected && (
                    <Check size={16} className={'gradeSelectDropdown-check'} aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
