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
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { incrementModalCount, decrementModalCount } from '../store/slices/modalSlice';
import { useResponsiveModalScale } from '../hooks/useResponsiveMenuScale';
import './Modal.scss';

interface FormModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  maxWidth?: number | string;
  scale?: number;
  zIndex?: number;
  closeOnBackdrop?: boolean;
  title?: string;
}

const ENTER_MS = 320;
const DISMISS_MS = 240;

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 20px',
  borderBottom: '1px solid var(--b-input)',
};

const titleStyle: React.CSSProperties = {
  color: 'var(--t-primary)',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: 0,
};

const closeBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--b-input)',
  fontSize: '18px',
  cursor: 'pointer',
  color: 'var(--t-tertiary)',
  transition: 'background 0.2s',
  flexShrink: 0,
};

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 400,
  scale,
  zIndex = 10000,
  closeOnBackdrop = true,
  title,
}) => {
  const dispatch = useDispatch();
  const responsiveScale = useResponsiveModalScale();

  type Phase = null | 'enter' | 'idle' | 'exit';
  const [phase, setPhase] = useState<Phase>(null);
  const hasIncrementedRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setPhase('enter');
      const t = setTimeout(() => setPhase('idle'), ENTER_MS);
      return () => clearTimeout(t);
    } else {
      if (phase === null) return;
      setPhase('exit');
      exitTimerRef.current = setTimeout(() => {
        setPhase(null);
        exitTimerRef.current = null;
      }, DISMISS_MS);
    }

  }, [isOpen]);

  useEffect(() => {
    const visible = phase === 'enter' || phase === 'idle';
    if (visible && !hasIncrementedRef.current) {
      hasIncrementedRef.current = true;
      dispatch(incrementModalCount());
    } else if (!visible && hasIncrementedRef.current) {
      hasIncrementedRef.current = false;
      dispatch(decrementModalCount());
    }
  }, [phase, dispatch]);

  useEffect(() => {
    return () => {
      if (hasIncrementedRef.current) {
        dispatch(decrementModalCount());
        hasIncrementedRef.current = false;
      }
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };

  }, []);

  const triggerClose = () => {
    if (phase === 'exit' || phase === null) return;
    onClose?.();
    if (hasIncrementedRef.current) {
      dispatch(decrementModalCount());
      hasIncrementedRef.current = false;
    }
    setPhase('exit');
    exitTimerRef.current = setTimeout(() => {
      setPhase(null);
      exitTimerRef.current = null;
    }, DISMISS_MS);
  };

  if (phase === null) return null;

  const isExit = phase === 'exit';
  const maxW = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  const portalTarget = document.getElementById('modal-root') ?? document.body;
  const effectiveScale = scale ?? responsiveScale;

  return ReactDOM.createPortal(
    <div
      className={[
        'modal-backdrop',
        'modal-backdropScrollable',
        isExit ? 'modal-backdropExit' : 'modal-backdropEnter',
      ].join(' ')}
      style={{ zIndex }}
      onClick={closeOnBackdrop ? triggerClose : undefined}
    >
      <div
        className={effectiveScale !== 1 ? 'modal-scaleFrame' : undefined}
        style={{
          ...(effectiveScale !== 1
            ? ({ '--modal-scale': effectiveScale } as React.CSSProperties)
            : ({ width: '100%', display: 'flex', justifyContent: 'center' } as React.CSSProperties)),
          alignSelf: 'center',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
      <div
        className={[
          'modal-panel',
          'modal-panelForm',
          isExit ? 'modal-panelExit' : 'modal-panelEnter',
        ].join(' ')}
        style={{
          maxWidth: maxW,
        }}
        onClick={e => e.stopPropagation()}
      >
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="95%" cy="0" r="90"  fill="none" stroke="white" strokeWidth="1.2" opacity="0.09" />
          <circle cx="95%" cy="0" r="60"  fill="none" stroke="white" strokeWidth="0.8" opacity="0.07" />
          <circle cx="95%" cy="0" r="32"  fill="none" stroke="white" strokeWidth="0.6" opacity="0.05" />
          <circle cx="5%"  cy="100%" r="80"  fill="none" stroke="white" strokeWidth="1.2" opacity="0.08" />
          <circle cx="5%"  cy="100%" r="50"  fill="none" stroke="white" strokeWidth="0.8" opacity="0.06" />
          <circle cx="50%" cy="50%" r="120" fill="none" stroke="white" strokeWidth="0.7" opacity="0.05" />
          <circle cx="50%" cy="50%" r="72"  fill="none" stroke="white" strokeWidth="0.5" opacity="0.04" />
          <line x1="0" y1="20%"  x2="18%"  y2="0"  stroke="white" strokeWidth="0.8" opacity="0.12" strokeLinecap="round" />
          <line x1="0" y1="30%"  x2="12%"  y2="0"  stroke="white" strokeWidth="0.6" opacity="0.08" strokeLinecap="round" />
          <line x1="0" y1="42%"  x2="7%"   y2="0"  stroke="white" strokeWidth="0.5" opacity="0.05" strokeLinecap="round" />
          <line x1="82%" y1="100%" x2="100%" y2="72%"  stroke="white" strokeWidth="0.8" opacity="0.12" strokeLinecap="round" />
          <line x1="88%" y1="100%" x2="100%" y2="82%"  stroke="white" strokeWidth="0.6" opacity="0.08" strokeLinecap="round" />
          <line x1="8%" y1="28%" x2="11%" y2="28%" stroke="white" strokeWidth="1.2" opacity="0.18" strokeLinecap="round" />
          <line x1="9.5%" y1="25%" x2="9.5%" y2="31%" stroke="white" strokeWidth="1.2" opacity="0.18" strokeLinecap="round" />
          <line x1="88%" y1="15%" x2="91%" y2="15%" stroke="white" strokeWidth="1.2" opacity="0.16" strokeLinecap="round" />
          <line x1="89.5%" y1="12%" x2="89.5%" y2="18%" stroke="white" strokeWidth="1.2" opacity="0.16" strokeLinecap="round" />
          <circle cx="22%" cy="8%"  r="2.4" fill="white" opacity="0.20" />
          <circle cx="75%" cy="92%" r="2"   fill="white" opacity="0.16" />
          <circle cx="50%" cy="4%"  r="1.6" fill="white" opacity="0.14" />
          <circle cx="15%" cy="88%" r="1.8" fill="white" opacity="0.14" />
          <line x1="38%" y1="96%" x2="44%" y2="96%" stroke="white" strokeWidth="1" opacity="0.13" strokeLinecap="round" />
          <line x1="56%" y1="4%"  x2="62%" y2="4%"  stroke="white" strokeWidth="1" opacity="0.11" strokeLinecap="round" />
        </svg>

        {title && (
          <div style={{ ...headerStyle, position: 'relative', zIndex: 1 }}>
            <h2 style={titleStyle}>{title}</h2>
            <button
              style={closeBtnStyle}
              aria-label="Close"
              onClick={triggerClose}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--b-input)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)'; }}
            >×</button>
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
      </div>
    </div>,
    portalTarget
  );
};
