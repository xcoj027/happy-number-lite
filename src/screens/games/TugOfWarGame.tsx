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

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { GameScreenWrapper } from './GameScreenWrapper';
import { Player, GradeLevel } from '../../types/game.types';
import { QuizGeneratorFactory } from '../../quiz/QuizGeneratorFactory';
import type { GeneratedQuiz } from '../../quiz/types';
import './TugOfWarGame.scss';
import '../../styles/game-shared.scss';




const SOLO_ROUND_ADVANCE_MS = 1400;


const SOLO_CORRECT_SCORE = 10;

const WIN_PULLS = 6;


const SHAKE_PAD = 24;


const KID_SCALE = 2.4;

export interface TugOfWarQuestion {
  questionText: string;
  answers: string[];
  ropePosition: number;
  questionNumber: number;
  totalQuestions: number;
}

export interface TugOfWarRoundResult {
  id: string;
  playerId: string;
  playerName: string;
  team: 'A' | 'B';
  isCorrect: boolean;
  resolved: boolean;
  ropePosition: number;
  correctIndex?: number;
  allWrong?: boolean;
}

export interface TugOfWarGameResult {
  win: boolean;
  score: number;
  correct: number;
  wrong: number;
}

interface TugOfWarSoloProps {
	grade: GradeLevel;
	playerName: string;
	onFinish: (result: TugOfWarGameResult) => void;
	onBack: () => void;
}

type TugOfWarGameProps = TugOfWarSoloProps;










type HairStyle = 'spiky' | 'curly' | 'ponytail' | 'short' | 'bun';

interface SceneCharacter {
  seed: number;
  shirt: string;
  shirtShade: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
}

const TEAM_A_COLORS: SceneCharacter[] = [
  { seed: 0.15, shirt: '#38bdf8', shirtShade: '#0ea5e9', skin: '#f3c9a0', hair: '#3b2314', hairStyle: 'spiky' },
  { seed: 0.62, shirt: '#0ea5e9', shirtShade: '#0369a1', skin: '#e0ac6f', hair: '#1c1c1c', hairStyle: 'short' },
  { seed: 0.31, shirt: '#7dd3fc', shirtShade: '#38bdf8', skin: '#f3c9a0', hair: '#5b3a1e', hairStyle: 'ponytail' },
  { seed: 0.83, shirt: '#0284c7', shirtShade: '#075985', skin: '#c9925b', hair: '#241608', hairStyle: 'curly' },
  { seed: 0.47, shirt: '#38bdf8', shirtShade: '#0ea5e9', skin: '#e0ac6f', hair: '#7a4a20', hairStyle: 'bun' },
  { seed: 0.25, shirt: '#0ea5e9', shirtShade: '#0284c7', skin: '#f3c9a0', hair: '#c25e2b', hairStyle: 'spiky' },
  { seed: 0.74, shirt: '#38bdf8', shirtShade: '#0ea5e9', skin: '#c9925b', hair: '#1c1c1c', hairStyle: 'short' },
  { seed: 0.58, shirt: '#7dd3fc', shirtShade: '#0ea5e9', skin: '#e0ac6f', hair: '#3b2314', hairStyle: 'ponytail' },
  { seed: 0.91, shirt: '#0284c7', shirtShade: '#0369a1', skin: '#f3c9a0', hair: '#5b3a1e', hairStyle: 'curly' },
];

const TEAM_B_COLORS: SceneCharacter[] = [
  { seed: 0.22, shirt: '#fb7185', shirtShade: '#f43f5e', skin: '#f3c9a0', hair: '#241608', hairStyle: 'curly' },
  { seed: 0.71, shirt: '#f43f5e', shirtShade: '#be123c', skin: '#e0ac6f', hair: '#c25e2b', hairStyle: 'spiky' },
  { seed: 0.38, shirt: '#fda4af', shirtShade: '#fb7185', skin: '#c9925b', hair: '#1c1c1c', hairStyle: 'ponytail' },
  { seed: 0.9, shirt: '#e11d48', shirtShade: '#9f1239', skin: '#f3c9a0', hair: '#5b3a1e', hairStyle: 'short' },
  { seed: 0.55, shirt: '#fb7185', shirtShade: '#f43f5e', skin: '#e0ac6f', hair: '#3b2314', hairStyle: 'bun' },
  { seed: 0.19, shirt: '#f43f5e', shirtShade: '#e11d48', skin: '#f3c9a0', hair: '#1c1c1c', hairStyle: 'curly' },
  { seed: 0.66, shirt: '#fb7185', shirtShade: '#be123c', skin: '#c9925b', hair: '#7a4a20', hairStyle: 'spiky' },
  { seed: 0.81, shirt: '#fda4af', shirtShade: '#f43f5e', skin: '#e0ac6f', hair: '#241608', hairStyle: 'short' },
  { seed: 0.34, shirt: '#e11d48', shirtShade: '#9f1239', skin: '#f3c9a0', hair: '#5b3a1e', hairStyle: 'ponytail' },
];

function drawHair(
  ctx: CanvasRenderingContext2D,
  style: HairStyle,
  color: string,
  facing: 1 | -1,
  sway: number,
) {
  ctx.fillStyle = color;
  switch (style) {
    case 'spiky': {
      ctx.beginPath();
      for (let i = -2; i <= 2; i++) {
        const bx = i * 3.4;
        const tipY = -30 - Math.abs(i) * 1.5 - 2;
        ctx.moveTo(bx - 2.2, -22);
        ctx.lineTo(bx + sway * 0.4, tipY);
        ctx.lineTo(bx + 2.2, -22);
      }
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -23, 8.2, Math.PI, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'curly': {
      [[-6, -25], [-2, -28], [2.5, -28], [6.5, -25], [0, -30]].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx, by, 4.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(0, -22, 8.4, Math.PI, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'ponytail': {
      ctx.beginPath();
      ctx.arc(0, -23, 8.6, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-facing * 6, -24);
      ctx.quadraticCurveTo(-facing * 16 + sway, -14, -facing * 12 + sway * 1.4, 2);
      ctx.quadraticCurveTo(-facing * 10 + sway, -10, -facing * 4, -20);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'bun': {
      ctx.beginPath();
      ctx.arc(0, -23, 8.4, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -32, 3.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'short':
    default: {
      ctx.beginPath();
      ctx.arc(0, -23, 8.6, Math.PI, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

function drawKid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 1 | -1,
  scene: SceneCharacter,
  time: number,
  pullStrength: number,
  scale: number = 1,
) {
  const effort = Math.min(1, pullStrength);
  const bob = Math.sin(time * 1.8 + scene.seed * 10) * (3.2 - effort * 1.4);
  const march = Math.sin(time * 4 + scene.seed * 6) * (4.5 + effort * 4.5);
  const sway = Math.sin(time * 1.3 + scene.seed * 7) * 4;
  const leanBase = facing * (10 + effort * 20);
  const armPull = Math.sin(time * 5 + scene.seed * 6) * (3 + effort * 4);
  const squat = effort * 5;

  ctx.save();
  ctx.translate(x, y + (bob + squat * 0.4) * scale);
  ctx.rotate((leanBase * Math.PI) / 180);
  ctx.scale(scale, scale);


  ctx.save();
  ctx.translate(0, 40 - squat * 0.3);
  ctx.scale(1 + effort * 0.18, 0.28);
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 30, 15, 0.38)';
  ctx.fill();
  ctx.restore();


  ctx.strokeStyle = '#2b3a66';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-4 * facing, 16 - squat * 0.5);
  ctx.lineTo(-4 * facing - facing * effort * 6 + march * 0.25, 24 - squat * 0.5);
  ctx.lineTo(-6 * facing - facing * effort * 9, 38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4 * facing, 16 - squat * 0.5);
  ctx.lineTo(4 * facing + facing * effort * 4 - march * 0.25, 24 - squat * 0.5);
  ctx.lineTo(7 * facing + facing * effort * 6, 38);
  ctx.stroke();


  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-6 * facing - facing * effort * 9, 39, 5.2, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7 * facing + facing * effort * 6, 39, 5.2, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-9 * facing - facing * effort * 9, 40, 7 * facing, 1.6);
  ctx.fillRect(4 * facing + facing * effort * 6, 40, 7 * facing, 1.6);


  const bodyGrad = ctx.createLinearGradient(-11, -12, 11, 20);
  bodyGrad.addColorStop(0, scene.shirt);
  bodyGrad.addColorStop(1, scene.shirtShade);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-11, 20 - squat * 0.6);
  ctx.quadraticCurveTo(0, 6 - squat * 0.4, 11, 20 - squat * 0.6);
  ctx.lineTo(9, -6);
  ctx.quadraticCurveTo(0, -12, -9, -6);
  ctx.closePath();
  ctx.fill();


  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-8, 2);
  ctx.lineTo(8, 2);
  ctx.stroke();


  ctx.strokeStyle = scene.skin;
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(6 * facing, -4);
  ctx.lineTo(18 * facing, 3 + armPull * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6 * facing, -2);
  ctx.lineTo(19 * facing, -7 - armPull * 0.3);
  ctx.stroke();

  ctx.fillStyle = scene.skin;
  ctx.beginPath();
  ctx.arc(18 * facing, 3 + armPull * 0.3, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(19 * facing, -7 - armPull * 0.3, 3.2, 0, Math.PI * 2);
  ctx.fill();


  ctx.fillStyle = scene.skin;
  ctx.beginPath();
  ctx.arc(0, -18 - squat * 0.3, 9.8, 0, Math.PI * 2);
  ctx.fill();

  drawHair(ctx, scene.hairStyle, scene.hair, facing, sway);


  ctx.fillStyle = facing === 1 ? '#38bdf8' : '#fb7185';
  ctx.fillRect(-9.5, -23.5 - squat * 0.3, 19, 3.2);


  const eyeY = -18 - squat * 0.3;
  const blinking = Math.sin(time * 0.6 + scene.seed * 30) > 0.975;

  if (blinking) {
    ctx.strokeStyle = 'rgba(30,20,12,0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(1.6 * facing, eyeY);
    ctx.lineTo(4.6 * facing, eyeY);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(3.4 * facing, eyeY, 2.3, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(25,18,12,0.95)';
    ctx.beginPath();
    ctx.arc(3.9 * facing, eyeY + 0.3, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }


  ctx.strokeStyle = 'rgba(30,20,12,0.85)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  if (effort > 0.35) {
    ctx.moveTo(1.2 * facing, eyeY - 5.5);
    ctx.lineTo(5.8 * facing, eyeY - 2.8);
  } else {
    ctx.moveTo(1.5 * facing, eyeY - 4.4);
    ctx.lineTo(5.5 * facing, eyeY - 3);
  }
  ctx.stroke();


  if (effort > 0.35) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(120, 30, 30, 0.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(1.2 * facing, eyeY + 5, 4.2 * facing, 3.2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.strokeStyle = 'rgba(30,20,12,0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0.5 * facing, eyeY + 6);
    ctx.lineTo(3.5 * facing, eyeY + 6.2);
    ctx.stroke();
  }


  ctx.fillStyle = 'rgba(251, 113, 133, 0.4)';
  ctx.beginPath();
  ctx.arc(-2 * facing, eyeY + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();


  if (effort > 0.45 && Math.sin(time * 4 + scene.seed * 12) > 0.1) {
    ctx.fillStyle = 'rgba(186, 230, 253, 0.95)';
    ctx.beginPath();
    ctx.moveTo(-8 * facing, eyeY - 6);
    ctx.quadraticCurveTo(-11 * facing, eyeY - 2, -8 * facing, eyeY);
    ctx.quadraticCurveTo(-5.5 * facing, eyeY - 2, -8 * facing, eyeY - 6);
    ctx.fill();
  }

  ctx.restore();
}



function drawCloudShape(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y - 8 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 38 * scale, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y + 6 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawClouds(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const layers = [
    { yFrac: 0.14, speed: 6, scale: 1.05, count: 3, alpha: 0.95 },
    { yFrac: 0.25, speed: 3.2, scale: 0.68, count: 4, alpha: 0.7 },
  ];
  layers.forEach((layer, li) => {
    const spacing = w / layer.count + 60;
    for (let i = 0; i < layer.count + 1; i++) {
      const baseX = i * spacing;
      const x = ((baseX + time * layer.speed) % (w + 160)) - 80;
      const y = h * layer.yFrac + Math.sin(time * 0.3 + i * 1.7 + li) * 4;
      drawCloudShape(ctx, x, y, layer.scale, layer.alpha);
    }
  });
}


function drawGrassDetail(ctx: CanvasRenderingContext2D, w: number, groundY: number, h: number, time: number) {
  const flowerCount = Math.max(5, Math.round(w / 110));
  const span = Math.max(20, h - groundY - 20);
  for (let i = 0; i < flowerCount; i++) {
    const seed = ((i * 53) % 17) / 17;
    const x = seed * w;
    const y = groundY + 14 + ((i * 29) % span);
    const sway = Math.sin(time * 1.4 + seed * 9) * 1.2;
    ctx.save();
    ctx.translate(x + sway, y);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let p = 0; p < 5; p++) {
      const ang = (p / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(ang) * 2.4, Math.sin(ang) * 2.4, 1.6, 1.1, ang, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f4c542';
    ctx.beginPath();
    ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function buildTugBackgroundCache(w: number, h: number, groundY: number): HTMLCanvasElement {
  const off = document.createElement('canvas');
  off.width = w + SHAKE_PAD * 2;
  off.height = h;
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  ctx.translate(SHAKE_PAD, 0);


  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#4fb1e8');
  sky.addColorStop(0.55, '#a7dff0');
  sky.addColorStop(0.82, '#eaf6e0');
  sky.addColorStop(1, '#eaf6e0');
  ctx.fillStyle = sky;
  ctx.fillRect(-SHAKE_PAD, 0, w + SHAKE_PAD * 2, h);


  const sun = ctx.createRadialGradient(w * 0.82, h * 0.16, 4, w * 0.82, h * 0.16, w * 0.28);
  sun.addColorStop(0, 'rgba(255, 250, 210, 0.9)');
  sun.addColorStop(1, 'rgba(255, 250, 210, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(-SHAKE_PAD, 0, w + SHAKE_PAD * 2, h);


  const count = Math.max(6, Math.round(w / 70));
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) * (w / count);
    const seed = ((i * 37) % 13) / 13;
    const size = 30 + seed * 22;
    ctx.save();
    ctx.translate(x, groundY - 2);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(21, 82, 51, 0.55)' : 'rgba(27, 99, 61, 0.5)';
    ctx.beginPath();
    ctx.arc(0, -size * 0.55, size * 0.5, 0, Math.PI * 2);
    ctx.arc(-size * 0.35, -size * 0.3, size * 0.38, 0, Math.PI * 2);
    ctx.arc(size * 0.35, -size * 0.3, size * 0.38, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }


  const ground = ctx.createLinearGradient(0, groundY, 0, h);
  ground.addColorStop(0, '#8ed36b');
  ground.addColorStop(0.4, '#6dbf4f');
  ground.addColorStop(1, '#4a9a3a');
  ctx.fillStyle = ground;
  ctx.fillRect(-SHAKE_PAD, groundY, w + SHAKE_PAD * 2, h - groundY);


  ctx.fillStyle = 'rgba(150, 105, 55, 0.35)';
  ctx.fillRect(-SHAKE_PAD, groundY - 4, w + SHAKE_PAD * 2, 10);

  return off;
}









function drawBraidedRope(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  time: number,
) {
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(cx, cy, x1, y1);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x0, y0 - 2);
  ctx.quadraticCurveTo(cx, cy - 2, x1, y1 - 2);
  ctx.stroke();

  const segments = 46;
  let prevX = x0;
  let prevY = y0;
  ctx.lineWidth = 1.6;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const mt = 1 - t;
    const px = mt * mt * x0 + 2 * mt * t * cx + t * t * x1;
    const py = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
    const tx = px - prevX;
    const ty = py - prevY;
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    const twist = Math.sin(t * Math.PI * 16 + time * 3) * 2.6;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(58, 36, 14, 0.55)' : 'rgba(224, 186, 130, 0.4)';
    ctx.beginPath();
    ctx.moveTo(px - nx * twist, py - ny * twist);
    ctx.lineTo(px + nx * twist, py + ny * twist);
    ctx.stroke();
    prevX = px;
    prevY = py;
  }
}



interface SceneParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape: 'dot' | 'confetti';
}

function spawnDust(list: SceneParticle[], x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = Math.PI + (Math.random() - 0.5) * 1.6;
    const speed = 20 + Math.random() * 40;
    list.push({
      x: x + (Math.random() - 0.5) * 20,
      y,
      vx: Math.cos(angle) * speed,
      vy: -Math.random() * 30 - 10,
      life: 0,
      maxLife: 0.5 + Math.random() * 0.4,
      size: 1.5 + Math.random() * 2,
      color: 'rgba(150, 111, 61, 0.55)',
      shape: 'dot',
    });
  }
}

function spawnConfetti(list: SceneParticle[], x: number, y: number, colors: string[], count: number) {
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const speed = 70 + Math.random() * 130;
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 0.7 + Math.random() * 0.5,
      size: 2.5 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: 'confetti',
    });
  }
}

function updateAndDrawParticles(ctx: CanvasRenderingContext2D, list: SceneParticle[], dt: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.life += dt;
    if (p.life >= p.maxLife) {
      list.splice(i, 1);
      continue;
    }
    p.vy += 220 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const alpha = Math.max(0, 1 - p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    if (p.shape === 'confetti') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 6 + p.x * 0.05);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}








export interface RosterEntry {
  name: string;
  isNpc: boolean;
}

const MIN_TEAM_SIZE = 3;
const NPC_NAMES_A = ['Bin', 'Chip', 'Tom'];
const NPC_NAMES_B = ['Mia', 'Sun', 'Kay'];

function buildRoster(team: Player[], npcNames: string[]): RosterEntry[] {
  const roster: RosterEntry[] = team.map(p => ({ name: p.name, isNpc: false }));
  let npcIdx = 0;
  while (roster.length < MIN_TEAM_SIZE) {
    roster.push({ name: npcNames[npcIdx % npcNames.length], isNpc: true });
    npcIdx += 1;
  }
  return roster;
}

function drawNameTag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: string,
  opts: { npc?: boolean; isMe?: boolean; scale?: number } = {},
) {
  const scale = opts.scale ?? 1;
  const label = name.length > 10 ? `${name.slice(0, 9)}\u2026` : name;
  ctx.save();
  ctx.font = '700 10px "Nunito", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const paddingX = 6;
  const textWidth = ctx.measureText(label).width;
  const boxW = textWidth + paddingX * 2;
  const boxH = 15;
  const tagY = y - (34 * scale + 12);
  const r = boxH / 2;
  ctx.beginPath();
  ctx.moveTo(x - boxW / 2 + r, tagY - boxH / 2);
  ctx.arcTo(x + boxW / 2, tagY - boxH / 2, x + boxW / 2, tagY + boxH / 2, r);
  ctx.arcTo(x + boxW / 2, tagY + boxH / 2, x - boxW / 2, tagY + boxH / 2, r);
  ctx.arcTo(x - boxW / 2, tagY + boxH / 2, x - boxW / 2, tagY - boxH / 2, r);
  ctx.arcTo(x - boxW / 2, tagY - boxH / 2, x + boxW / 2, tagY - boxH / 2, r);
  ctx.closePath();
  ctx.fillStyle = opts.npc ? 'rgba(71, 85, 105, 0.72)' : 'rgba(15, 23, 42, 0.74)';
  ctx.fill();
  if (opts.isMe) {
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.95)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
  ctx.fillStyle = opts.npc ? 'rgba(255, 255, 255, 0.8)' : '#ffffff';
  ctx.fillText(label, x, tagY + 0.5);
  ctx.restore();
}








function computeTagYOffsets(tags: { x: number }[]): number[] {
  const n = tags.length;
  if (n <= 1) return new Array(n).fill(0);
  const sorted = tags.map((t, i) => ({ x: t.x, idx: i })).sort((a, b) => a.x - b.x);
  const offsets = new Array(n).fill(0);
  let clusterStart = 0;
  for (let i = 1; i <= sorted.length; i++) {
    const isLast = i === sorted.length;
    const overlaps = !isLast && (sorted[i].x - sorted[i - 1].x) < 70;
    if (!overlaps || isLast) {
      for (let j = clusterStart; j < i; j++) {
        if ((j - clusterStart) % 2 === 1) offsets[sorted[j].idx] = -16;
      }
      clusterStart = i;
    }
  }
  return offsets;
}



export const TugOfWarGame: React.FC<TugOfWarGameProps> = (props) => {
	const { grade, playerName, onFinish } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
  const bgCacheRef = useRef<{ canvas: HTMLCanvasElement; w: number; h: number } | null>(null);





	const [soloQuiz, setSoloQuiz] = useState<GeneratedQuiz | null>(() =>
		QuizGeneratorFactory.create('math', grade).get()
	);
  const [soloRopePosition, setSoloRopePosition] = useState(0);
  const [soloRoundResult, setSoloRoundResult] = useState<TugOfWarRoundResult | null>(null);
  const [soloHasAnswered, setSoloHasAnswered] = useState(false);
  const [soloRoundNumber, setSoloRoundNumber] = useState(1);
  const soloCorrectRef = useRef(0);
  const soloWrongRef = useRef(0);
  const soloRoundIdRef = useRef(0);
  const soloFinishedRef = useRef(false);

  const soloAnswerLabels = soloQuiz
    ? (soloQuiz.answers_en ?? soloQuiz.answers)
    : [];
  const soloQuestionText = soloQuiz
    ? (soloQuiz.questionText_en ?? soloQuiz.questionText)
    : '';

  const handleSoloSubmit = useCallback((index: number) => {
    if (!soloQuiz || soloHasAnswered) return;
    const correctIndex = soloQuiz.answers.indexOf(soloQuiz.correctAnswer);
    const isCorrect = index === correctIndex;
    if (isCorrect) soloCorrectRef.current += 1; else soloWrongRef.current += 1;
    const nextPos = Math.max(-WIN_PULLS, Math.min(WIN_PULLS, soloRopePosition + (isCorrect ? -1 : 1)));
    soloRoundIdRef.current += 1;
    setSoloHasAnswered(true);
    setSoloRopePosition(nextPos);
    setSoloRoundResult({
      id: `solo-${soloRoundIdRef.current}`,
      playerId: 'solo-player',
      playerName,
      team: isCorrect ? 'A' : 'B',
      isCorrect,
      resolved: true,
      ropePosition: nextPos,
      correctIndex,
    });
  }, [soloQuiz, soloHasAnswered, soloRopePosition, playerName]);



	useEffect(() => {
		if (!soloRoundResult) return;
		const finished = Math.abs(soloRoundResult.ropePosition) >= WIN_PULLS;
		const timer = setTimeout(() => {
			if (finished) {
				if (soloFinishedRef.current) return;
				soloFinishedRef.current = true;
				onFinish({
					win: soloRoundResult.ropePosition <= -WIN_PULLS,
					score: soloCorrectRef.current * SOLO_CORRECT_SCORE,
					correct: soloCorrectRef.current,
					wrong: soloWrongRef.current,
				});
			} else {
				setSoloQuiz(QuizGeneratorFactory.create('math', grade).get());
				setSoloHasAnswered(false);
				setSoloRoundResult(null);
				setSoloRoundNumber(n => n + 1);
			}
		}, SOLO_ROUND_ADVANCE_MS);
		return () => clearTimeout(timer);

	}, [soloRoundResult]);




const question: TugOfWarQuestion = {
		questionText: soloQuestionText,
		answers: soloAnswerLabels,
		ropePosition: soloRopePosition,
		questionNumber: soloRoundNumber,
		totalQuestions: WIN_PULLS,
	};
	const ropePosition = soloRopePosition;
	const roundResult = soloRoundResult;
	const hasAnswered = soloHasAnswered;
	const players = useMemo<Player[]>(
		() => [{ id: 'solo-player', name: playerName, score: 0, isHost: true, team: 'A' as const }],
		[playerName],
	);
	const onSubmitAnswer = handleSoloSubmit;

  const me = players.find(p => p.name === playerName) || null;
  const myTeam = me?.team ?? null;



  const pullsA = Math.max(0, Math.round(-ropePosition));
  const pullsB = Math.max(0, Math.round(ropePosition));

  const teamA = useMemo(() => players.filter(p => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter(p => p.team === 'B'), [players]);
  const teamARoster = useMemo(() => buildRoster(teamA, NPC_NAMES_A), [teamA]);
  const teamBRoster = useMemo(() => buildRoster(teamB, NPC_NAMES_B), [teamB]);



  const ropeDisplayRef = useRef(0);
  const ropeTargetRef = useRef(ropePosition);
  const pullPulseRef = useRef(0);
  const shakeAmpRef = useRef(0);
  const pendingBurstRef = useRef<'A' | 'B' | null>(null);
  const particlesRef = useRef<SceneParticle[]>([]);
  const timeRef = useRef(0);
  ropeTargetRef.current = ropePosition;

  const [selected, setSelected] = useState<number | null>(null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);


  useEffect(() => {
    setSelected(null);
    setWrongPick(null);
  }, [question.questionNumber]);



  const lastRoundIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!roundResult || roundResult.id === lastRoundIdRef.current) return;
    lastRoundIdRef.current = roundResult.id;
    pullPulseRef.current = 1;
    if (roundResult.resolved) {
      pendingBurstRef.current = roundResult.team;
      shakeAmpRef.current = 7;
    } else if (roundResult.allWrong) {
      setWrongPick(selected);
    } else if (roundResult.playerId === me?.id) {
      setWrongPick(selected);
    }

  }, [roundResult]);

  const handleAnswer = useCallback((index: number) => {
    if (hasAnswered || (roundResult?.resolved)) return;
    setSelected(index);
    onSubmitAnswer(index);
  }, [hasAnswered, roundResult, onSubmitAnswer]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const isMobile = rect.width <= 640 || (typeof window !== 'undefined' && window.innerWidth <= 640);
      const dpr = Math.min(window.devicePixelRatio ?? 1, isMobile ? 1.5 : 2);
      const desiredW = Math.round(rect.width * dpr);
      const desiredH = Math.round(rect.height * dpr);
      if (
        canvas.width === desiredW &&
        canvas.height === desiredH &&
        Math.abs(sizeRef.current.w - rect.width) < 0.5 &&
        Math.abs(sizeRef.current.h - rect.height) < 0.5
      ) return;

      canvas.width = desiredW;
      canvas.height = desiredH;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      const groundY = rect.height * 0.64;
      bgCacheRef.current = {
        canvas: buildTugBackgroundCache(rect.width, rect.height, groundY),
        w: rect.width,
        h: rect.height,
      };
    };
    resize();
    const t1 = setTimeout(resize, 50);
    const t2 = setTimeout(resize, 200);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(container);
    }
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      timeRef.current += dt;
      raf = requestAnimationFrame(render);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = sizeRef.current.w;
      const h = sizeRef.current.h;
      if (w === 0 || h === 0) {


        return;
      }


      ropeDisplayRef.current += (ropeTargetRef.current - ropeDisplayRef.current) * Math.min(dt * 4, 1);
      pullPulseRef.current = Math.max(0, pullPulseRef.current - dt * 0.6);
      shakeAmpRef.current = Math.max(0, shakeAmpRef.current - dt * 18);

      const shakeAmp = shakeAmpRef.current;
      const shakeX = shakeAmp > 0.05 ? (Math.random() - 0.5) * shakeAmp : 0;
      const shakeY = shakeAmp > 0.05 ? (Math.random() - 0.5) * shakeAmp * 0.6 : 0;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(shakeX, shakeY);


      if (bgCacheRef.current && bgCacheRef.current.w === w && bgCacheRef.current.h === h) {
        ctx.drawImage(bgCacheRef.current.canvas, -SHAKE_PAD, 0);
      }

      drawClouds(ctx, w, h, timeRef.current);

      const groundY = h * 0.64;
      drawGrassDetail(ctx, w, groundY, h, timeRef.current);


      const centerX = w / 2;
      const notchSpacing = Math.min(34, (w * 0.42) / WIN_PULLS);
      for (let i = -WIN_PULLS; i <= WIN_PULLS; i++) {
        const nx = centerX + i * notchSpacing;
        const active = Math.abs(i) <= Math.abs(ropeDisplayRef.current) && Math.sign(i || 1) === Math.sign(ropeDisplayRef.current || 1) && i !== 0;
        ctx.beginPath();
        ctx.arc(nx, groundY, i === 0 ? 4 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = i === 0
          ? 'rgba(255,255,255,0.9)'
          : active ? '#ffd94a' : 'rgba(255,255,255,0.55)';
        ctx.fill();
      }




      const ropeOffsetX = ropeDisplayRef.current * notchSpacing;
      const ropeMidX = centerX + ropeOffsetX;
      const handRise = 4 * KID_SCALE;
      const feetDrop = 40 * KID_SCALE;


      const characterY = groundY - feetDrop + 26;
      const ropeY = characterY - handRise;

      const sag = Math.max(6, 19 - pullPulseRef.current * 11)
        + Math.sin(timeRef.current * 1.6) * 2.2 * (1 - pullPulseRef.current * 0.6);
      drawBraidedRope(ctx, w * 0.06, ropeY, ropeMidX, ropeY + sag, w * 0.94, ropeY, timeRef.current);


      ctx.save();
      ctx.translate(ropeMidX, ropeY + sag * 0.5 - 9);
      const flap = Math.sin(timeRef.current * 6) * 4 + pullPulseRef.current * 3;
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 6);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(14 + flap, -7);
      ctx.lineTo(0, -2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const pull = pullPulseRef.current;
      const teamACount = teamARoster.length;
      const teamBCount = teamBRoster.length;
      const rowSpan = Math.min(64, (w * 0.36) / 5) * KID_SCALE;


      const teamAXs = teamARoster.map((entry, i) => {
        const spread = (i - (teamACount - 1) / 2) * rowSpan * 0.42;
        return centerX + ropeOffsetX - w * 0.2 + spread;
      });
      const teamATagOffsets = computeTagYOffsets(teamAXs.map(x => ({ x })));
      teamARoster.forEach((entry, i) => {
        const scene = TEAM_A_COLORS[i % TEAM_A_COLORS.length];
        const x = teamAXs[i];
        const idleEffort = 0.14 + (Math.sin(timeRef.current * 1.1 + i * 1.7) * 0.5 + 0.5) * 0.14;
        const effortLevel = roundResult?.resolved && roundResult.team === 'A' ? pull : idleEffort;
        drawKid(ctx, x, characterY, 1, scene, timeRef.current, effortLevel, KID_SCALE);
        drawNameTag(ctx, x, characterY + teamATagOffsets[i], entry.name, { npc: entry.isNpc, isMe: !entry.isNpc && entry.name === playerName, scale: KID_SCALE });
      });


      const teamBXs = teamBRoster.map((entry, i) => {
        const spread = (i - (teamBCount - 1) / 2) * rowSpan * 0.42;
        return centerX + ropeOffsetX + w * 0.2 + spread;
      });
      const teamBTagOffsets = computeTagYOffsets(teamBXs.map(x => ({ x })));
      teamBRoster.forEach((entry, i) => {
        const scene = TEAM_B_COLORS[i % TEAM_B_COLORS.length];
        const x = teamBXs[i];
        const idleEffort = 0.14 + (Math.sin(timeRef.current * 1.1 + i * 1.7 + 3) * 0.5 + 0.5) * 0.14;
        const effortLevel = roundResult?.resolved && roundResult.team === 'B' ? pull : idleEffort;
        drawKid(ctx, x, characterY, -1, scene, timeRef.current, effortLevel, KID_SCALE);
        drawNameTag(ctx, x, characterY + teamBTagOffsets[i], entry.name, { npc: entry.isNpc, isMe: !entry.isNpc && entry.name === playerName, scale: KID_SCALE });
      });


      if (pendingBurstRef.current) {
        const burstTeam = pendingBurstRef.current;
        const bx = centerX + ropeOffsetX + (burstTeam === 'A' ? -w * 0.2 : w * 0.2);
        const by = characterY;
        const palette = burstTeam === 'A'
          ? ['#38bdf8', '#0ea5e9', '#bae6fd', '#ffffff']
          : ['#fb7185', '#f43f5e', '#fecdd3', '#ffffff'];
        spawnConfetti(particlesRef.current, bx, by, palette, 22);
        spawnDust(particlesRef.current, centerX + ropeOffsetX, groundY, 10);
        pendingBurstRef.current = null;
      }
      updateAndDrawParticles(ctx, particlesRef.current, dt);

      ctx.restore();
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', resize);
    };

  }, [teamARoster.length, teamBRoster.length, roundResult?.id, roundResult?.team, roundResult?.resolved]);

  const roundIsOpen = !hasAnswered && !roundResult?.resolved && !roundResult?.allWrong;
  const waitingForNext = !!roundResult?.resolved;
  const showingCorrect = !!roundResult?.allWrong;

const wrapperProps = {
		topBarProps: {
			modeLabel: 'Tug of War',
			grade,
		},
	};

  return (
    <GameScreenWrapper {...wrapperProps} onBack={props.onBack}>
      <div className={'tugOfWarGame-stage'}>
        <div className={'tugOfWarGame-scaleWrap'}>
        <div className={'tugOfWarGame-root'}>
{}
          {}
          <div className={'tugOfWarGame-hud'}>
            <div className={'tugOfWarGame-scoreboard'}>
              <div className={['tugOfWarGame-scoreTeam', 'tugOfWarGame-scoreTeamA', myTeam === 'A' ? 'tugOfWarGame-myTeam' : ''].filter(Boolean).join(' ')}>
                <span className={'tugOfWarGame-scoreCrest'} aria-hidden="true">A</span>
                <span className={'tugOfWarGame-scoreTeamName'}>Team A</span>
              </div>
              <div className={'tugOfWarGame-scoreCenter'}>
                <div className={'tugOfWarGame-scoreDigits'}>
                  <span className={'tugOfWarGame-scoreDigitA'}>{pullsA}</span>
                  <span className={'tugOfWarGame-scoreDash'}>-</span>
                  <span className={'tugOfWarGame-scoreDigitB'}>{pullsB}</span>
                </div>
                <div className={'tugOfWarGame-scoreMeta'}>{`#${question.questionNumber}`}</div>
              </div>
              <div className={['tugOfWarGame-scoreTeam', 'tugOfWarGame-scoreTeamB', myTeam === 'B' ? 'tugOfWarGame-myTeam' : ''].filter(Boolean).join(' ')}>
                <span className={'tugOfWarGame-scoreTeamName'}>Team B</span>
                <span className={'tugOfWarGame-scoreCrest'} aria-hidden="true">B</span>
              </div>
            </div>

            <div className={'tugOfWarGame-rosterRow'}>
              <div className={'tugOfWarGame-rosterHalfA'}>
                {teamARoster.map((entry, i) => (
                  <span
                    key={entry.isNpc ? `npc-a-${i}` : entry.name}
                    className={['tugOfWarGame-teamMember', entry.isNpc ? 'tugOfWarGame-teamMemberNpc' : ''].filter(Boolean).join(' ')}
                  >
                    {entry.name}
                  </span>
                ))}
              </div>
              <div className={'tugOfWarGame-rosterHalfB'}>
                {teamBRoster.map((entry, i) => (
                  <span
                    key={entry.isNpc ? `npc-b-${i}` : entry.name}
                    className={['tugOfWarGame-teamMember', entry.isNpc ? 'tugOfWarGame-teamMemberNpc' : ''].filter(Boolean).join(' ')}
                  >
                    {entry.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {}
          <div ref={containerRef} className={'tugOfWarGame-canvasWrapper'}>
            <canvas ref={canvasRef} className={'tugOfWarGame-canvas'} />
          </div>

          {}
          <div className={'tugOfWarGame-questionArea'} key={question.questionNumber}>
            <div className={'tugOfWarGame-questionCard'}>
              <div className={'tugOfWarGame-questionAccent'} aria-hidden="true" />
              <div className={'tugOfWarGame-questionText'}>{question.questionText}</div>
              <div className={['tugOfWarGame-hint', waitingForNext ? 'tugOfWarGame-hintWaiting' : '', showingCorrect ? 'tugOfWarGame-hintWaiting' : ''].filter(Boolean).join(' ')}>
                {showingCorrect ? 'All wrong! Correct answer shown in 3s...' : waitingForNext ? 'Next question coming up...' : 'First correct answer pulls the rope!'}
              </div>
            </div>
            <div className={'tugOfWarGame-answerGrid'}>
              {question.answers.map((answer, idx) => {
                const isSelected = selected === idx;
                const isRevealedCorrect = (roundResult?.resolved || roundResult?.allWrong) && roundResult.correctIndex === idx;
                const isWrongPick = wrongPick === idx && !isRevealedCorrect;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={[
                      'tugOfWarGame-answerBtn',
                      `tugOfWarGame-answerBtn${idx % 6}`,
                      isSelected ? 'tugOfWarGame-answerSelected' : '',
                      isRevealedCorrect ? 'tugOfWarGame-answerCorrect' : '',
                      isWrongPick ? 'tugOfWarGame-answerWrong' : '',
                    ].filter(Boolean).join(' ')}
                    disabled={!roundIsOpen}
                    onClick={() => handleAnswer(idx)}
                  >
                    <span className={'tugOfWarGame-answerBadge'}>
                      {isRevealedCorrect ? <Check size={16} strokeWidth={3} />
                        : isWrongPick ? <X size={16} strokeWidth={3} />
                        : String.fromCharCode(65 + idx)}
                    </span>
                    <span className={'tugOfWarGame-answerLabel'}>{answer}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </div>
    </GameScreenWrapper>
  );
};
