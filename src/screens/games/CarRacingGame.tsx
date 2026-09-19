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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GradeLevel } from '../../types/game.types';
import { GameScreenWrapper } from './GameScreenWrapper';
import { resetModalCount, selectModalCount } from '../../store/slices/modalSlice';
import type { AppDispatch } from '../../store/store';
import './CarRacingGame.scss';
import '../../styles/game-shared.scss';
import { RACING_PALETTE, debugRacing, type CarRacingGameResult, type ObstacleData, type CloverData, type LogoDecalData, type RoadsidePropData, type Snowflake, type Particle, type FloatingText, nextId, laneX, grassWidth, spawnObstacleGroup, drawBackground, drawSnowBanks, drawRoad, drawHolidayPineTree, drawSnowman, drawCandyCane, drawGiftBox, drawSnowflakes, drawPlayerCar, drawBarrier, drawClover, drawLogoDecal, drawParticles, drawFloatingTexts, compactInPlace, resetRoadsideRenderCache, GAME_DURATION_SECONDS, INITIAL_SPEED, MAX_SPEED, LANE_SWITCH_SPEED, MIN_TRAVEL_SECS, FIRST_WAVE_DELAY_SECS, FIRST_WAVE_TRAVEL_SECS, LANE_COUNT, PLAYER_W, PLAYER_H, OBS_W, OBS_H, CLOVER_R, PARTICLE_LIFE, CLOVER_SCORE, OBS_CORRECT_SCORE, OBS_WRONG_PENALTY, KM_PER_PX, LOGO_SPAWN_INTERVAL_SECS, LOGO_SIZE } from './CarRacingRender';
export type { CarRacingGameResult } from './CarRacingRender';

interface SoloProps {
	grade: GradeLevel;
	playerName: string;
	onFinish: (result: CarRacingGameResult) => void;
	onBack: () => void;
}

export const CarRacingGame: React.FC<SoloProps> = (props) => {
	const { grade, playerName, onFinish } = props;
	const dispatch = useDispatch<AppDispatch>();

	const modalCount = useSelector(selectModalCount);
	const racingPalette = RACING_PALETTE;
	const gamePausedRef = useRef(false);
	gamePausedRef.current = modalCount > 0;

	useEffect(() => {
		dispatch(resetModalCount());
	}, [dispatch]);


	const canvasRef     = useRef<HTMLCanvasElement>(null);
	const containerRef  = useRef<HTMLDivElement>(null);
	const sizeRef       = useRef<{ w: number; h: number; gW: number; dpr: number }>({ w: 0, h: 0, gW: 0, dpr: 1 });
	const rafRef        = useRef<number>(0);
	const lastTRef      = useRef<number>(0);
	const timeRef       = useRef<number>(0);
	const gameActiveRef = useRef<boolean>(false);

	const scoreRef       = useRef(0);
	const kmRef          = useRef(0);
	const scrollPxRef    = useRef(0);
	const timeLeftRef    = useRef(GAME_DURATION_SECONDS);
	const lastSecRef     = useRef(0);
	const correctRef     = useRef(0);
	const wrongRef       = useRef(0);
	const speedRef       = useRef(INITIAL_SPEED);
	const roadOffsetRef  = useRef(0);
	const comboRef       = useRef(0);
	const comboTimerRef  = useRef(0);

	const playerLaneRef  = useRef<number>(1);
	const playerXRef     = useRef<number>(0);
	const playerYRef     = useRef<number>(0);
	const lastKeyRef     = useRef<number>(0);
	const touchStartXRef = useRef<number>(0);

	const obstaclesRef     = useRef<ObstacleData[]>([]);
	const cloversRef       = useRef<CloverData[]>([]);
	const logoDecalsRef    = useRef<LogoDecalData[]>([]);
	const nextLogoRef      = useRef<number>(LOGO_SPAWN_INTERVAL_SECS);
	const logoImgRef       = useRef<HTMLImageElement | null>(null);
	const roadsidePropsRef = useRef<RoadsidePropData[]>([]);
	const nextPropDistRef  = useRef<number>(140);
	const snowflakesRef    = useRef<Snowflake[]>([]);

	useEffect(() => {
		const img = new Image();
		img.src = '/assets/TNQ.png';
		logoImgRef.current = img;
	}, []);

	const particlesRef   = useRef<Particle[]>([]);
	const floatingTxRef  = useRef<FloatingText[]>([]);
	const nextObsRef     = useRef<number>(2.0);
	const nextCloverRef  = useRef<number>(0.8);
	const idCountRef     = useRef<number>(0);
	const firstWaveRef   = useRef<boolean>(true);

	const waveActiveRef  = useRef<boolean>(false);
	const waveClearedRef = useRef<boolean>(false);
	const activeAnswerRef = useRef<number | null>(null);

	const pendingScoreRef    = useRef<number | null>(null);
	const pendingTimeRef     = useRef<number | null>(null);
	const pendingCarNumRef   = useRef<number | null | undefined>(undefined);


	const [score,     setScore]     = useState(0);
	const [timeLeft,  setTimeLeft]  = useState(GAME_DURATION_SECONDS);
	const [gamePhase, setGamePhase] = useState<'playing' | 'finished'>('playing');
	const resultRef = useRef<CarRacingGameResult | null>(null);
	const [carNumber,   setCarNumber]   = useState<number | null>(null);

	const flushHUD = useCallback(() => {
		if (pendingScoreRef.current !== null) {
			setScore(pendingScoreRef.current);
			pendingScoreRef.current = null;
		}
		if (pendingTimeRef.current !== null) {
			setTimeLeft(pendingTimeRef.current);
			pendingTimeRef.current = null;
		}
		if (pendingCarNumRef.current !== undefined) {
			setCarNumber(pendingCarNumRef.current as number | null);
			pendingCarNumRef.current = undefined;
		}
	}, []);

	const spawnParticles = useCallback((
		cx: number, cy: number,
		colors: string[], count: number, upBoost: number,
	) => {
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const spd   = 80 + Math.random() * 150;
			particlesRef.current.push({
				x: cx, y: cy,
				vx: Math.cos(angle) * spd,
				vy: Math.sin(angle) * spd - upBoost,
				life: PARTICLE_LIFE * (0.6 + Math.random() * 0.4), maxLife: PARTICLE_LIFE,
				size: 4 + Math.random() * 4,
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}
	}, []);

	const addFloatText = useCallback((
		x: number, y: number, text: string, color: string, life = 0.9,
	) => {
		floatingTxRef.current.push({ x, y, text, life, maxLife: life, color });
	}, []);

	const moveLeft  = useCallback(() => {
		if (gamePausedRef.current) return;
		if (playerLaneRef.current > 0) playerLaneRef.current--;
		debugRacing('move-left', { lane: playerLaneRef.current, active: gameActiveRef.current });
	}, []);
	const moveRight = useCallback(() => {
		if (gamePausedRef.current) return;
		if (playerLaneRef.current < LANE_COUNT - 1) playerLaneRef.current++;
		debugRacing('move-right', { lane: playerLaneRef.current, active: gameActiveRef.current });
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (gamePausedRef.current) return;
			const now = performance.now() / 1000;
			if (now - lastKeyRef.current < 0.08) return;
			if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { e.preventDefault(); moveLeft();  lastKeyRef.current = now; }
			if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); moveRight(); lastKeyRef.current = now; }
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [moveLeft, moveRight]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const onStart = (e: TouchEvent) => { touchStartXRef.current = e.touches[0].clientX; };
		const onEnd   = (e: TouchEvent) => {
			if (gamePausedRef.current) return;
			const dx   = e.changedTouches[0].clientX - touchStartXRef.current;
			const rect = canvas.getBoundingClientRect();
			if (Math.abs(dx) < 12) {
				const tapX = e.changedTouches[0].clientX - rect.left;
				if (tapX < rect.width / 2) moveLeft();
				else moveRight();
			} else {
				if (dx < -20) moveLeft();
				else if (dx > 20) moveRight();
			}
		};
		canvas.addEventListener('touchstart', onStart, { passive: true });
		canvas.addEventListener('touchend',   onEnd,   { passive: true });
		return () => {
			canvas.removeEventListener('touchstart', onStart);
			canvas.removeEventListener('touchend',   onEnd);
		};
	}, [moveLeft, moveRight]);

	const endGame = useCallback(() => {
		gameActiveRef.current = false;
		cancelAnimationFrame(rafRef.current);
		resultRef.current = {
			km:      parseFloat(kmRef.current.toFixed(2)),
			score:   scoreRef.current,
			correct: correctRef.current,
			wrong:   wrongRef.current,
		};
		setGamePhase('finished');
	}, []);

	const handleGoToResults = useCallback(() => {
		if (resultRef.current) onFinish(resultRef.current);
	}, [onFinish]);

	const startGame = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return false;
		const ctx = canvas.getContext('2d', { desynchronized: true });
		if (!ctx) return false;

		scoreRef.current       = 0;
		kmRef.current          = 0;
		scrollPxRef.current    = 0;
		timeLeftRef.current    = GAME_DURATION_SECONDS;
		lastSecRef.current     = 0;
		correctRef.current     = 0;
		wrongRef.current       = 0;
		speedRef.current       = INITIAL_SPEED;
		roadOffsetRef.current  = 0;
		comboRef.current       = 0;
		comboTimerRef.current  = 0;
		playerLaneRef.current  = 1;
		lastKeyRef.current     = 0;
		obstaclesRef.current   = [];
		cloversRef.current     = [];
		logoDecalsRef.current  = [];
		nextLogoRef.current    = LOGO_SPAWN_INTERVAL_SECS;
		particlesRef.current   = [];
		floatingTxRef.current  = [];
		nextObsRef.current     = FIRST_WAVE_DELAY_SECS;
		nextCloverRef.current  = 0.8;
		idCountRef.current     = 0;
		firstWaveRef.current   = true;
		waveActiveRef.current  = false;
		waveClearedRef.current = false;
		timeRef.current        = 0;
		activeAnswerRef.current = null;
		pendingScoreRef.current = null;
		pendingTimeRef.current  = null;
		pendingCarNumRef.current = undefined;
		gameActiveRef.current  = true;
		gamePausedRef.current  = false;
		lastTRef.current       = performance.now();

		if (sizeRef.current.w === 0 || sizeRef.current.h === 0) {
			const rect = (containerRef.current ?? canvas).getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) {
				gameActiveRef.current = false;
				return false;
			}
			const isMobile = rect.width <= 640 || window.innerWidth <= 640;
			const dpr = Math.min(window.devicePixelRatio ?? 1, isMobile ? 1.5 : 2);
			canvas.width        = Math.round(rect.width * dpr);
			canvas.height       = Math.round(rect.height * dpr);
			canvas.style.width  = '100%';
			canvas.style.height = '100%';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			sizeRef.current = {
				w: rect.width,
				h: rect.height,
				gW: grassWidth(rect.width),
				dpr,
			};
		}

		const curW = sizeRef.current.w || 600;
		const curH = sizeRef.current.h || 800;
		const initFlakes: Snowflake[] = [];
		for (let i = 0; i < 45; i++) {
			initFlakes.push({
				x: Math.random() * curW,
				y: Math.random() * curH,
				r: 1.2 + Math.random() * 2.2,
				speed: 30 + Math.random() * 55,
				swaySpeed: 1.5 + Math.random() * 2.0,
				swayAmp: 8 + Math.random() * 14,
				phase: Math.random() * Math.PI * 2,
				alpha: 0.4 + Math.random() * 0.55,
			});
		}
		snowflakesRef.current = initFlakes;

		const initProps: RoadsidePropData[] = [];
		const propTypes: RoadsidePropData['type'][] = ['tree', 'snowman', 'candyCane', 'giftBox', 'tree'];
		const spacing = 160;
		const count = Math.ceil((curH + 200) / spacing) + 2;
		for (let i = 0; i < count; i++) {
			const py = -80 + i * spacing;
			initProps.push({
				id: nextId(),
				side: 'left',
				laneOffset: 0.25 + Math.random() * 0.5,
				y: py,
				type: propTypes[Math.floor(Math.random() * propTypes.length)],
				scale: 0.85 + Math.random() * 0.35,
				variant: Math.floor(Math.random() * 4),
			});
			initProps.push({
				id: nextId(),
				side: 'right',
				laneOffset: 0.25 + Math.random() * 0.5,
				y: py + spacing * 0.5,
				type: propTypes[Math.floor(Math.random() * propTypes.length)],
				scale: 0.85 + Math.random() * 0.35,
				variant: Math.floor(Math.random() * 4),
			});
		}
		roadsidePropsRef.current = initProps;
		nextPropDistRef.current = 140;

		playerXRef.current = laneX(1, sizeRef.current.w);
		playerYRef.current = sizeRef.current.h - PLAYER_H / 2 - 30;
		debugRacing('start', { width: sizeRef.current.w, height: sizeRef.current.h, firstWaveDelay: FIRST_WAVE_DELAY_SECS });

		setScore(0);
		setTimeLeft(GAME_DURATION_SECONDS);
		setCarNumber(null);
		setGamePhase('playing');
		resetRoadsideRenderCache();

		const loop = (now: number) => {
			if (!gameActiveRef.current) return;
			if (gamePausedRef.current) {
				lastTRef.current = now;
				rafRef.current = requestAnimationFrame(loop);
				return;
			}

			const { w: W, h: H, gW } = sizeRef.current;
			if (W === 0 || H === 0) {
				lastTRef.current = now;
				rafRef.current = requestAnimationFrame(loop);
				return;
			}

			const dt = Math.min((now - lastTRef.current) / 1000, 0.05);
			lastTRef.current  = now;
			timeRef.current  += dt;

			lastSecRef.current += dt;
			if (lastSecRef.current >= 1) {
				lastSecRef.current -= 1;
				timeLeftRef.current = Math.max(0, timeLeftRef.current - 1);
				pendingTimeRef.current = timeLeftRef.current;
				if (timeLeftRef.current <= 0) { flushHUD(); endGame(); return; }
			}

			const progress       = 1 - timeLeftRef.current / GAME_DURATION_SECONDS;
			speedRef.current     = INITIAL_SPEED + (MAX_SPEED - INITIAL_SPEED) * Math.pow(progress, 1.4);
			const spd             = speedRef.current;
			roadOffsetRef.current = (roadOffsetRef.current + speedRef.current * dt) % 10000;

			scrollPxRef.current += speedRef.current * dt;
			kmRef.current        = scrollPxRef.current * KM_PER_PX;

			comboTimerRef.current -= dt;
			if (comboTimerRef.current <= 0) comboRef.current = 0;

			const targetX  = laneX(playerLaneRef.current, W);
			const dx       = targetX - playerXRef.current;
			const maxDx    = LANE_SWITCH_SPEED * dt;
			if (Math.abs(dx) <= maxDx) playerXRef.current = targetX;
			else playerXRef.current += Math.sign(dx) * maxDx;

			nextCloverRef.current -= dt;
			if (nextCloverRef.current <= 0) {
				const cloverBlockedLanes = new Set(
					obstaclesRef.current
						.filter(o => o.state === 'alive' && o.y < 0)
						.map(o => o.lane)
						.concat(
							cloversRef.current
								.filter(c => !c.collected && c.y < 0)
								.map(c => c.lane)
						)
				);
				const cFreeLanes = [0, 1, 2].filter(l => !cloverBlockedLanes.has(l));
				const cl = cFreeLanes.length > 0
					? cFreeLanes[Math.floor(Math.random() * cFreeLanes.length)]
					: Math.floor(Math.random() * LANE_COUNT);
				cloversRef.current.push({
					id: nextId(), lane: cl,
					y: -CLOVER_R * 2,
					collected: false, collectAnim: 1, pulse: 0,
				});
				nextCloverRef.current = 0.9 + Math.random() * 0.8;
			}

			nextLogoRef.current -= dt;
			if (nextLogoRef.current <= 0) {
				logoDecalsRef.current.push({
					id: nextId(),
					lane: Math.floor(Math.random() * LANE_COUNT),
					y: -LOGO_SIZE * 2,
				});
				nextLogoRef.current = LOGO_SPAWN_INTERVAL_SECS;
			}

			nextPropDistRef.current -= spd * dt;
			if (nextPropDistRef.current <= 0) {
				const types: RoadsidePropData['type'][] = ['tree', 'snowman', 'candyCane', 'giftBox', 'tree'];
				const side: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';
				roadsidePropsRef.current.push({
					id: nextId(),
					side,
					laneOffset: 0.2 + Math.random() * 0.6,
					y: -90,
					type: types[Math.floor(Math.random() * types.length)],
					scale: 0.85 + Math.random() * 0.35,
					variant: Math.floor(Math.random() * 4),
				});
				if (Math.random() < 0.65) {
					roadsidePropsRef.current.push({
						id: nextId(),
						side: side === 'left' ? 'right' : 'left',
						laneOffset: 0.2 + Math.random() * 0.6,
						y: -90 - Math.random() * 40,
						type: types[Math.floor(Math.random() * types.length)],
						scale: 0.85 + Math.random() * 0.35,
						variant: Math.floor(Math.random() * 4),
					});
				}
				nextPropDistRef.current = 140 + Math.random() * 90;
			}

			const rProps = roadsidePropsRef.current;
			for (let i = 0; i < rProps.length; i++) {
				rProps[i].y += spd * dt;
			}
			compactInPlace(rProps, p => p.y < H + 120);

			const flakes = snowflakesRef.current;
			for (let i = 0; i < flakes.length; i++) {
				const f = flakes[i];
				f.y += (f.speed + spd * 0.18) * dt;
				if (f.y > H + 12) {
					f.y = -10;
					f.x = Math.random() * W;
				}
			}

			if (waveActiveRef.current && !waveClearedRef.current) {
				const anyLeft = obstaclesRef.current.some(o => o.state === 'alive' || o.state === 'wrong-flash');
				if (!anyLeft) {
					waveActiveRef.current  = false;
					waveClearedRef.current = false;
					nextObsRef.current     = 1.0 + Math.random() * 0.5;
				}
			}
			if (!waveActiveRef.current && !waveClearedRef.current) {
				nextObsRef.current -= dt;
				if (nextObsRef.current <= 0) {
					const isFirstWave = firstWaveRef.current;
					const travelSecs = isFirstWave ? FIRST_WAVE_TRAVEL_SECS : MIN_TRAVEL_SECS;
					const travelPx  = speedRef.current * travelSecs;
					const spawnY    = Math.min(-(travelPx - playerYRef.current + OBS_H * 0.5), -OBS_H - 20);
					const busyLanes = new Set<number>(
						cloversRef.current.filter(c => !c.collected && c.y < spawnY + OBS_H * 3).map(c => c.lane),
					);
					const group = spawnObstacleGroup(grade, idCountRef.current, spawnY, busyLanes, speedRef.current);
					const visibleGroup = isFirstWave ? group.slice(0, 2) : group;
					if (visibleGroup.length > 0) {
						idCountRef.current += visibleGroup.length;
						obstaclesRef.current.push(...visibleGroup);
						firstWaveRef.current = false;
						waveActiveRef.current  = true;
						waveClearedRef.current = false;
						debugRacing('wave-spawned', {
							first: isFirstWave,
							spawnY,
							travelSecs,
							count: visibleGroup.length,
							carNumber: visibleGroup[0]?.correctAnswer,
						});
					} else { nextObsRef.current = 1.0; }
				}
			}

			const clovers = cloversRef.current;
			for (let i = 0; i < clovers.length; i++) {
				const c = clovers[i];
				c.y    += spd * dt;
				c.pulse = timeRef.current;
				if (c.collected) c.collectAnim -= dt * 3;
			}
			compactInPlace(clovers, c => c.y < H + 60 && (!c.collected || c.collectAnim > 0));

			const logoDecals = logoDecalsRef.current;
			for (let i = 0; i < logoDecals.length; i++) logoDecals[i].y += spd * dt;
			compactInPlace(logoDecals, l => l.y < H + LOGO_SIZE);

			const obs = obstaclesRef.current;
			for (let i = 0; i < obs.length; i++) {
				obs[i].y += spd * dt;
				if (obs[i].state !== 'alive') obs[i].flashTimer -= 1;
			}
			compactInPlace(obs, o => {
				if (o.state === 'clearing'    && o.flashTimer <= 0) return false;
				if (o.state === 'wrong-flash' && o.flashTimer <= 0) return false;
				if (o.y > H + 20) return false;
				return true;
			});

			{
				const barrier = obstaclesRef.current.find(o => o.state === 'alive');
				const next = barrier ? barrier.correctAnswer : null;
				if (next !== activeAnswerRef.current) {
					activeAnswerRef.current = next;
					pendingCarNumRef.current = next;
				}
			}

			const pX = playerXRef.current;
			const pY = playerYRef.current;
			for (const c of cloversRef.current) {
				if (c.collected) continue;
				const cdx = pX - laneX(c.lane, W);
				const cdy = pY - c.y;
				if (Math.abs(cdx) > CLOVER_R + 24 || Math.abs(cdy) > CLOVER_R + 24) continue;
				const dist = Math.sqrt(cdx * cdx + cdy * cdy);
				if (dist < CLOVER_R + 24) {
					c.collected           = true;
					c.collectAnim         = 1;
					scoreRef.current     += CLOVER_SCORE;
					pendingScoreRef.current = scoreRef.current;
					spawnParticles(laneX(c.lane, W), c.y, ['#fde047', '#4ade80', '#ef4444', '#ffffff', '#38bdf8'], 14, 65);
					addFloatText(laneX(c.lane, W), c.y - 20, `+${CLOVER_SCORE}`, '#4ade80');
				}
			}

			{
				const hitW = (PLAYER_W + OBS_W) * 0.38;
				const hitH = (PLAYER_H + OBS_H) * 0.38;
				let hitThisFrame = false;
				const obsArr = obstaclesRef.current;
				for (let i = 0; i < obsArr.length; i++) {
					const o = obsArr[i];
					if (o.state !== 'alive' || hitThisFrame) continue;
					const ox = laneX(o.lane, W);
					const oy = o.y + OBS_H / 2;
					if (Math.abs(pX - ox) >= hitW || Math.abs(pY - oy) >= hitH) continue;
					hitThisFrame = true;

					if (o.isCorrect) {
						correctRef.current++;
						scoreRef.current     += OBS_CORRECT_SCORE;
						pendingScoreRef.current = scoreRef.current;
						spawnParticles(ox, oy, ['#4ade80', '#86efac', '#fde047', '#ffffff'], 16, 75);

						o.state = 'clearing';
						o.flashTimer = 22;
					} else {
						wrongRef.current++;
						scoreRef.current = scoreRef.current - OBS_WRONG_PENALTY;
						pendingScoreRef.current = scoreRef.current;
						comboRef.current      = 0;
						comboTimerRef.current = 0;
						spawnParticles(pX, pY, ['#ef4444', '#f97316', '#fbbf24', '#ffffff'], 14, 80);

						o.state = 'wrong-flash';
						o.flashTimer = 20;
					}
				}
			}

			const parts = particlesRef.current;
			for (let i = 0; i < parts.length; i++) {
				const p = parts[i];
				p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; p.life -= dt;
			}
			compactInPlace(parts, p => p.life > 0);
			const ftx = floatingTxRef.current;
			for (let i = 0; i < ftx.length; i++) ftx[i].life -= dt;
			compactInPlace(ftx, ft => ft.life > 0);


			ctx.clearRect(0, 0, W, H);

			drawBackground(ctx, W, H, racingPalette);
			drawSnowBanks(ctx, W, H, gW, racingPalette);
			drawRoad(ctx, W, H, gW, roadOffsetRef.current, racingPalette);

			if (gW > 12) {
				for (const p of roadsidePropsRef.current) {
					const propX = p.side === 'left'
						? gW * p.laneOffset
						: (W - gW) + gW * p.laneOffset;
					if (p.type === 'tree') {
						drawHolidayPineTree(ctx, propX, p.y, p.scale, timeRef.current, racingPalette);
					} else if (p.type === 'snowman') {
						drawSnowman(ctx, propX, p.y, p.scale, timeRef.current, racingPalette);
					} else if (p.type === 'candyCane') {
						drawCandyCane(ctx, propX, p.y, p.scale);
					} else {
						drawGiftBox(ctx, propX, p.y, p.scale, p.variant);
					}
				}
			}

			if (logoImgRef.current) {
				for (const l of logoDecalsRef.current) {
					drawLogoDecal(ctx, logoImgRef.current, laneX(l.lane, W), l.y, LOGO_SIZE);
				}
			}

			for (const c of cloversRef.current) {
				drawClover(ctx, laneX(c.lane, W), c.y, CLOVER_R, c.pulse, c.collected, c.collectAnim);
			}
			for (const o of obstaclesRef.current) {
				drawBarrier(ctx, o, laneX(o.lane, W), timeRef.current);
			}

			drawPlayerCar(ctx, playerXRef.current, playerYRef.current);
			drawParticles(ctx, particlesRef.current);
			drawFloatingTexts(ctx, floatingTxRef.current);
			drawSnowflakes(ctx, snowflakesRef.current, timeRef.current, racingPalette);

			flushHUD();

			rafRef.current = requestAnimationFrame(loop);
		};

		rafRef.current = requestAnimationFrame(loop);
		return true;
	}, [grade, endGame, spawnParticles, addFloatText, flushHUD, racingPalette]);

	const startGameRef = useRef(startGame);
	useEffect(() => {
		startGameRef.current = startGame;
	}, [startGame]);


	useEffect(() => {
		const resize = () => {
			const canvas    = canvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;
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

			canvas.width        = desiredW;
			canvas.height       = desiredH;
			canvas.style.width  = '100%';
			canvas.style.height = '100%';
			const ctx = canvas.getContext('2d', { desynchronized: true });
			if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			sizeRef.current = {
				w: rect.width,
				h: rect.height,
				gW: grassWidth(rect.width),
				dpr,
			};

			playerXRef.current = laneX(playerLaneRef.current, rect.width);
			playerYRef.current = rect.height - PLAYER_H / 2 - 30;
			resetRoadsideRenderCache();
		};

		resize();
		const t1 = setTimeout(resize, 50);
		const t2 = setTimeout(resize, 200);

		let ro: ResizeObserver | null = null;
		if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
			ro = new ResizeObserver(resize);
			ro.observe(containerRef.current);
		} else {
			window.addEventListener('resize', resize);
		}
		window.addEventListener('resize', resize);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			if (ro) ro.disconnect();
			window.removeEventListener('resize', resize);
		};
	}, []);

  const gameStartedRef = useRef(false);
  useEffect(() => {
    if (gameStartedRef.current) return;
    const tryStart = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      const rect = (containerRef.current ?? canvas).getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w > 0 && h > 0) {
        gameStartedRef.current = startGameRef.current();
      }
    };

    const rAF = requestAnimationFrame(tryStart);

    const t1 = setTimeout(tryStart, 60);
    const t2 = setTimeout(tryStart, 250);
    const t3 = setTimeout(tryStart, 500);
    const t4 = setTimeout(tryStart, 1000);

    return () => {
      gameActiveRef.current  = false;
      gameStartedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(rAF);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);


  const wrapperProps = {
    topBarProps: {
      playerName, modeLabel: 'Find Bigger Number', grade,
    },
  };

  return (
    <GameScreenWrapper {...wrapperProps} onBack={props.onBack} canvasGame>
      <div className={'carRacingGame-raceRoot'}>
        <div className={'carRacingGame-scaleWrap'}>

        {}
        <div className={'carRacingGame-hud'}>
          <div className={'carRacingGame-hudSection'}>
            <div className={'carRacingGame-hudLabel'}>SCORE</div>
            <div className={'carRacingGame-hudValue'}>{score}</div>
          </div>
          <div className={'carRacingGame-hudSection'}>
            <div className={'carRacingGame-hudLabel'}>TIME</div>
            <div className={'carRacingGame-hudValue'}>{timeLeft}s</div>
          </div>
        </div>

        {}
        <div className={`${'carRacingGame-carSign'} ${carNumber !== null ? 'carRacingGame-visible' : ''}`}>
          <span className={`${'carRacingGame-carSignNumber'} ${String(carNumber ?? '').length >= 4 ? 'carRacingGame-carSignNumberSm' : ''}`}>{carNumber}</span>
        </div>

        {}
        <div className={'carRacingGame-hintBar'}>
          <span className={'carRacingGame-hintBoard'}>
            <span className={'carRacingGame-hintText'}>
            {carNumber !== null
              ? (
                <>
                  <span>Move the car to the lane with </span>
                  <strong>bigger numbers</strong>
                </>
              ) : (
                <>
                  <strong>bigger numbers</strong>
                  <span> than your car to score</span>
                </>
              )
            }
          </span>
          </span>
          <span className={'carRacingGame-hintPosts'} aria-hidden="true">
            <span className={'carRacingGame-hintPost'} />
            <span className={'carRacingGame-hintPost'} />
          </span>
        </div>

        {}
        <div ref={containerRef} className={'carRacingGame-canvasWrapper'}>
          <canvas ref={canvasRef} className={'carRacingGame-canvas'} />
        </div>

        {}
        <div className={'carRacingGame-virtualControls'}>
          <button className={'carRacingGame-vBtn'} onPointerDown={() => moveLeft()} aria-label="Move Left">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className={'carRacingGame-vBtn'} onPointerDown={() => moveRight()} aria-label="Move Right">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {}
        {gamePhase === 'finished' && (
          <div className={'carRacingGame-finishedOverlay'}>
            <div className={'carRacingGame-finishedCard'}>
              <div className={'carRacingGame-finishedTitle'}>Finished!</div>
              <div className={'carRacingGame-finishedScore'}>{score} pts</div>
              <div className={'carRacingGame-finishedSub'}>
                {correctRef.current} correct - {wrongRef.current} wrong
              </div>
              <button
                className={'carRacingGame-resultsBtn'}
                onClick={handleGoToResults}
              >
                View results
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </GameScreenWrapper>
  );
};
