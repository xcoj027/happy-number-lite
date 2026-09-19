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
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Topbar.scss';

interface TopbarProps {
  showBackButton?: boolean;
  backTo?: string | number;
  hideHomeButton?: boolean;
  onBack?: () => void;
}

function getDefaultBackTarget(pathname: string): string | number {
  if (pathname === '/result') return '/';
  if (pathname === '/play') return '/';
  return -1;
}

export function Topbar({
  showBackButton,
  backTo,
  hideHomeButton,
  onBack,
}: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldShowBack = showBackButton !== undefined
    ? showBackButton
    : hideHomeButton !== undefined
      ? !hideHomeButton
      : true;
  const resolvedBackTarget = useMemo(
    () => backTo ?? getDefaultBackTarget(location.pathname),
    [backTo, location.pathname],
  );

  const handleBackClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof resolvedBackTarget === 'number') {
      navigate(resolvedBackTarget);
      return;
    }
    navigate(resolvedBackTarget);
  };

  return (
    <div className={'topbar-topbar'}>
      <div className="flex gap-2">
        {shouldShowBack ? (
          <button
            onClick={handleBackClick}
            className={'topbar-backBtn'}
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div />
        )}
      </div>

      <div className="flex-1" />
    </div>
  );
}
