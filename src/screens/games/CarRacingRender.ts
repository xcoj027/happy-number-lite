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


import { GradeLevel } from '../../types/game.types';

export const GAME_DURATION_SECONDS = 90;
export const INITIAL_SPEED         = 200;
export const MAX_SPEED             = 520;
export const LANE_SWITCH_SPEED     = 480;
export const MIN_TRAVEL_SECS       = 6;
export const FIRST_WAVE_DELAY_SECS = 0.35;
export const FIRST_WAVE_TRAVEL_SECS = 3.2;
export const LANE_COUNT            = 3;

export const LANE_W_FACTOR = 2.2;

export const PLAYER_W          = 52;
export const PLAYER_H          = 88;
export const OBS_W             = 120;
export const OBS_H             =  60;
export const CLOVER_R          = 18;
export const PARTICLE_LIFE     = 0.7;
export const CLOVER_SCORE      = 2;
export const OBS_CORRECT_SCORE = 10;
export const OBS_WRONG_PENALTY = 5;
export const KM_PER_PX         = 0.003;

export const LOGO_SPAWN_INTERVAL_SECS = 20;
export const LOGO_SIZE                = 64;
export const LOGO_OPACITY             = 0.16;

export const RACING_PALETTE = {
	bgTop: '#040d1a',
	bgBottom: '#0a192f',
	aurora: 'rgba(56, 189, 248, 0.18)',
	snowBank: '#1e293b',
	snowDrift: 'rgba(148, 163, 184, 0.25)',
	road: '#0f172a',
	roadEdge: '#38bdf8',
	laneDash: 'rgba(255, 255, 255, 0.45)',
	treePine: '#064e3b',
	treeSnow: '#f8fafc',
	treeLights: ['#f59e0b', '#ef4444', '#10b981', '#38bdf8'],
	starGlow: '#fef08a',
	snowmanBody: '#f1f5f9',
	snowParticle: 'rgba(255, 255, 255, 0.85)',
	headlight: 'rgba(56, 189, 248, 0.50)',
} as const;

export type RacingThemePalette = typeof RACING_PALETTE;

export const COLORS = {
	playerBody: '#dc2626',
	playerWin:  '#e0f2fe',
	playerDtl:  '#991b1b',
	clover:     '#10b981',
	cloverDark: '#047857',
	cloverStem: '#065f46',
};

export const OBS_CAR_COLORS: [string, string][] = [
	['#0a1628', '#60a5fa'],
	['#1a0a2e', '#c084fc'],
	['#001a2e', '#11f3ff'],
	['#1a0800', '#fb923c'],
	['#0f0f1a', '#a5b4fc'],
	['#1a0014', '#f472b6'],
];

export function debugRacing(message: string, data?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	const enabled = window.localStorage.getItem('happyNumberRacingDebug') === '1'
		|| window.location.search.includes('racingDebug=1');
	if (enabled) console.info(`[CarRacing] ${message}`, data ?? '');
}



export interface CarRacingGameResult {
	km: number;
	score: number;
	correct: number;
	wrong: number;
}

export interface ObstacleData {
	id: number;
	lane: number;
	y: number;
	questionText: string;
	correctAnswer: number;
	isCorrect: boolean;
	barrierNumber: number;
	colorIdx: number;
	state: 'alive' | 'clearing' | 'wrong-flash';
	flashTimer: number;
}

export interface CloverData {
	id: number;
	lane: number;
	y: number;
	collected: boolean;
	collectAnim: number;
	pulse: number;
}

export interface LogoDecalData {
	id: number;
	lane: number;
	y: number;
}

export interface RoadsidePropData {
	id: number;
	side: 'left' | 'right';
	laneOffset: number;
	y: number;
	type: 'tree' | 'snowman' | 'candyCane' | 'giftBox';
	scale: number;
	variant: number;
}

export interface Snowflake {
	x: number;
	y: number;
	r: number;
	speed: number;
	swaySpeed: number;
	swayAmp: number;
	phase: number;
	alpha: number;
}

export interface Particle {
	x: number; y: number;
	vx: number; vy: number;
	life: number; maxLife: number;
	size: number; color: string;
}

export interface FloatingText {
	x: number; y: number;
	text: string;
	life: number; maxLife: number;
	color: string;
}



let _uid = 0;
export const nextId = () => ++_uid;

export function roundRect(
	ctx: CanvasRenderingContext2D,
	x: number, y: number, w: number, h: number, r: number,
) {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
	ctx.fill();
}

export function laneX(lane: number, canvasW: number): number {
	const roadW  = canvasW - grassWidth(canvasW) * 2;
	const laneW  = roadW / LANE_COUNT;
	const grassW = grassWidth(canvasW);
	return grassW + lane * laneW + laneW / 2;
}

export function grassWidth(canvasW: number): number {
	const fixedRoadW = PLAYER_W * LANE_W_FACTOR * LANE_COUNT;

	return Math.max(0, (canvasW - fixedRoadW) / 2);
}

export function getGradeRange(grade: GradeLevel): [number, number] {
	if (grade === 'multiplicationTable') return [1, 81];
	const g = typeof grade === 'number' ? grade : 3;
	const ranges: Record<number, [number, number]> = {
		1: [1,   100],
		2: [1,   100],
		3: [1,   200],
		4: [1,   500],
		5: [1,  1000],
	};
	return ranges[g] ?? [1, 100];
}

export function generateWave(grade: GradeLevel, speed: number): {
	carNumber: number;
	barrierNumbers: number[];
} {
	const [minN, maxN] = getGradeRange(grade);
	const carNumber = Math.floor(Math.random() * (maxN - minN - 2)) + minN + 1;

	const progress     = Math.min(1, (speed - 200) / 320);
	const spreadFactor = Math.max(1, Math.floor((maxN - minN) * (0.15 - progress * 0.10)));

	const count = 2 + (Math.random() < 0.45 ? 1 : 0);
	const used  = new Set<number>([carNumber]);
	const nums: number[] = [];

	for (let i = 0; i < count; i++) {
		let n: number;
		let attempts = 0;
		do {
			const bigger = i === 0 ? true : i === count - 1 ? false : Math.random() > 0.45;
			const delta  = Math.floor(Math.random() * spreadFactor) + 1;
			n = bigger ? carNumber + delta : carNumber - delta;
			n = Math.max(minN, Math.min(maxN, n));
			attempts++;
		} while (used.has(n) && attempts < 60);
		used.add(n);
		nums.push(n);
	}

	return { carNumber, barrierNumbers: nums };
}

export function spawnObstacleGroup(
	grade: GradeLevel,
	idBase: number,
	spawnY: number,
	busyLanes: Set<number>,
	speed: number,
): ObstacleData[] {
	const freeLanes = [0, 1, 2].filter(l => !busyLanes.has(l));
	if (freeLanes.length < 2) return [];

	const { carNumber, barrierNumbers } = generateWave(grade, speed);


	const correctNums = barrierNumbers.filter(n => n > carNumber);
	const wrongNums   = barrierNumbers.filter(n => n < carNumber);

	const guaranteed: number[] = [
		correctNums[0] ?? (carNumber + 1),
		wrongNums[0]   ?? (carNumber - 1 > 0 ? carNumber - 1 : carNumber + 2),
	];
	if (freeLanes.length >= 3 && barrierNumbers.length >= 3) {
		const extra = barrierNumbers.find(n => !guaranteed.includes(n));
		if (extra !== undefined) guaranteed.push(extra);
	}

	const count  = Math.min(guaranteed.length, freeLanes.length);
	const chosen = [...freeLanes].sort(() => Math.random() - 0.5).slice(0, count);
	const shuffled = [...guaranteed.slice(0, count)].sort(() => Math.random() - 0.5);
	const Y_GAP  = OBS_H + 32;

	return chosen.map((lane, i) => {
		const num       = shuffled[i];
		const isCorrect = num > carNumber;
		return {
			id:           idBase + i,
			lane,
			y:            spawnY - i * Y_GAP,
			questionText: String(num),
			correctAnswer: carNumber,
			isCorrect,
			barrierNumber: num,
			colorIdx:     Math.floor(Math.random() * OBS_CAR_COLORS.length),
			state:        'alive' as const,
			flashTimer:   0,
		};
	});
}




let _bgGradCache: { grad: CanvasGradient; H: number; top: string; bottom: string } | null = null;

export function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number, palette: RacingThemePalette) {
	if (!_bgGradCache || _bgGradCache.H !== H || _bgGradCache.top !== palette.bgTop || _bgGradCache.bottom !== palette.bgBottom) {
		const grad = ctx.createLinearGradient(0, 0, 0, H);
		grad.addColorStop(0, palette.bgTop);
		grad.addColorStop(1, palette.bgBottom);
		_bgGradCache = { grad, H, top: palette.bgTop, bottom: palette.bgBottom };
	}
	ctx.fillStyle = _bgGradCache.grad;
	ctx.fillRect(0, 0, W, H);


	ctx.save();
	ctx.fillStyle = palette.aurora;
	ctx.beginPath();
	ctx.ellipse(W / 2, 0, W * 0.7, H * 0.45, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}


let _snowBankGradLeft:  { grad: CanvasGradient; grassW: number; bankCol: string; driftCol: string } | null = null;
let _snowBankGradRight: { grad: CanvasGradient; grassW: number; roadEdge: number; bankCol: string; driftCol: string } | null = null;



export function resetRoadsideRenderCache() {
	_bgGradCache = null;
	_snowBankGradLeft = null;
	_snowBankGradRight = null;
}

export function drawSnowBanks(ctx: CanvasRenderingContext2D, W: number, H: number, grassW: number, palette: RacingThemePalette) {
	if (grassW <= 0) return;
	const roadX = grassW;
	const roadW = W - grassW * 2;


	if (!_snowBankGradLeft || _snowBankGradLeft.grassW !== grassW || _snowBankGradLeft.bankCol !== palette.snowBank || _snowBankGradLeft.driftCol !== palette.snowDrift) {
		const g = ctx.createLinearGradient(0, 0, roadX, 0);
		g.addColorStop(0, palette.snowBank);
		g.addColorStop(0.7, palette.snowBank);
		g.addColorStop(1, palette.snowDrift);
		_snowBankGradLeft = { grad: g, grassW, bankCol: palette.snowBank, driftCol: palette.snowDrift };
	}
	ctx.fillStyle = _snowBankGradLeft.grad;
	ctx.fillRect(0, 0, roadX, H);


	const rightEdge = roadX + roadW;
	if (!_snowBankGradRight || _snowBankGradRight.grassW !== grassW || _snowBankGradRight.roadEdge !== rightEdge || _snowBankGradRight.bankCol !== palette.snowBank || _snowBankGradRight.driftCol !== palette.snowDrift) {
		const g = ctx.createLinearGradient(rightEdge, 0, W, 0);
		g.addColorStop(0, palette.snowDrift);
		g.addColorStop(0.3, palette.snowBank);
		g.addColorStop(1, palette.snowBank);
		_snowBankGradRight = { grad: g, grassW, roadEdge: rightEdge, bankCol: palette.snowBank, driftCol: palette.snowDrift };
	}
	ctx.fillStyle = _snowBankGradRight.grad;
	ctx.fillRect(rightEdge, 0, grassW, H);
}


let _dashSet = false;
export function drawRoad(
	ctx: CanvasRenderingContext2D,
	W: number, H: number,
	grassW: number,
	roadOffset: number,
	palette: RacingThemePalette,
) {
	const roadX = grassW;
	const roadW = W - grassW * 2;
	const laneW = roadW / LANE_COUNT;

	ctx.fillStyle = palette.road;
	ctx.fillRect(roadX, 0, roadW, H);


	ctx.fillStyle = palette.roadEdge;
	ctx.fillRect(roadX - 4,          0, 5, H);
	ctx.fillRect(roadX + roadW - 1,  0, 5, H);


	ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
	ctx.fillRect(roadX + 6,          0, 2, H);
	ctx.fillRect(roadX + roadW - 8,  0, 2, H);


	ctx.strokeStyle    = palette.laneDash;
	ctx.lineWidth      = 4;
	if (!_dashSet) { ctx.setLineDash([48, 36]); _dashSet = true; }
	ctx.lineDashOffset = -roadOffset;
	for (let i = 1; i < LANE_COUNT; i++) {
		const x = roadX + i * laneW;
		ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
	}
	ctx.setLineDash([]);
	_dashSet = false;
}


export function drawHolidayPineTree(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
	scale: number,
	time: number,
	palette: RacingThemePalette,
) {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.scale(scale, scale);


	ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
	ctx.beginPath();
	ctx.ellipse(0, 24, 22, 9, 0, 0, Math.PI * 2);
	ctx.fill();


	ctx.fillStyle = '#78350f';
	ctx.fillRect(-5, 12, 10, 14);


	const tiers = [
		{ topY: -8,  botY: 16, w: 26 },
		{ topY: -22, botY: 2,  w: 20 },
		{ topY: -34, botY: -10, w: 14 },
	];

	for (const tier of tiers) {

		ctx.fillStyle = palette.treePine;
		ctx.beginPath();
		ctx.moveTo(0, tier.topY);
		ctx.lineTo(tier.w, tier.botY);
		ctx.lineTo(-tier.w, tier.botY);
		ctx.closePath();
		ctx.fill();


		ctx.fillStyle = palette.treeSnow;
		ctx.beginPath();
		ctx.moveTo(-tier.w, tier.botY);
		const bumpCount = 4;
		const bumpW = (tier.w * 2) / bumpCount;
		for (let b = 0; b < bumpCount; b++) {
			const bx = -tier.w + b * bumpW;
			ctx.quadraticCurveTo(bx + bumpW / 2, tier.botY + 3.5, bx + bumpW, tier.botY);
		}
		ctx.lineTo(tier.w, tier.botY - 2);
		ctx.lineTo(0, tier.topY + 3);
		ctx.lineTo(-tier.w, tier.botY - 2);
		ctx.closePath();
		ctx.fill();
	}


	const ornaments: [number, number, string][] = [
		[-12, 10, '#ef4444'], [10, 11, '#3b82f6'], [0, 8, '#f59e0b'],
		[-8, -2, '#10b981'],  [8, -1, '#ec4899'],
		[-5, -14, '#f59e0b'], [4, -13, '#ef4444'],
	];
	for (const [ox, oy, col] of ornaments) {
		ctx.fillStyle = col;
		ctx.beginPath();
		ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.arc(ox - 0.7, oy - 0.7, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}


	const lightCols = palette.treeLights;
	for (let i = 0; i < lightCols.length; i++) {
		const blink = 0.4 + 0.6 * Math.sin(time * 4 + i * 1.5);
		const lx = (i % 2 === 0 ? -1 : 1) * (5 + (i * 3) % 10);
		const ly = -24 + i * 10;
		ctx.fillStyle = lightCols[i];
		ctx.globalAlpha = blink;
		ctx.beginPath();
		ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	}


	ctx.fillStyle = palette.starGlow;
	const starY = -37;
	ctx.beginPath();
	for (let i = 0; i < 5; i++) {
		const aOuter = (i * 72 - 90) * (Math.PI / 180);
		const aInner = (i * 72 + 36 - 90) * (Math.PI / 180);
		const rx1 = Math.cos(aOuter) * 5.5, ry1 = starY + Math.sin(aOuter) * 5.5;
		const rx2 = Math.cos(aInner) * 2.5, ry2 = starY + Math.sin(aInner) * 2.5;
		if (i === 0) ctx.moveTo(rx1, ry1);
		else ctx.lineTo(rx1, ry1);
		ctx.lineTo(rx2, ry2);
	}
	ctx.closePath();
	ctx.fill();

	ctx.restore();
}


export function drawSnowman(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
	scale: number,
	time: number,
	palette: RacingThemePalette,
) {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.scale(scale, scale);


	ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
	ctx.beginPath();
	ctx.ellipse(0, 18, 18, 7, 0, 0, Math.PI * 2);
	ctx.fill();


	ctx.fillStyle = palette.snowmanBody;
	ctx.beginPath(); ctx.arc(0, 7, 14, 0, Math.PI * 2); ctx.fill();
	ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = 1; ctx.stroke();


	ctx.fillStyle = palette.snowmanBody;
	ctx.beginPath(); ctx.arc(0, -9, 10.5, 0, Math.PI * 2); ctx.fill();
	ctx.stroke();


	ctx.fillStyle = palette.snowmanBody;
	ctx.beginPath(); ctx.arc(0, -23, 8, 0, Math.PI * 2); ctx.fill();
	ctx.stroke();


	ctx.fillStyle = '#1e293b';
	ctx.beginPath();
	ctx.arc(0, -11, 1.8, 0, Math.PI * 2);
	ctx.arc(0, -6, 1.8, 0, Math.PI * 2);
	ctx.arc(0, 5, 2, 0, Math.PI * 2);
	ctx.fill();


	ctx.beginPath();
	ctx.arc(-2.8, -25, 1.2, 0, Math.PI * 2);
	ctx.arc(2.8, -25, 1.2, 0, Math.PI * 2);
	ctx.arc(-2.5, -20.5, 0.9, 0, Math.PI * 2);
	ctx.arc(0, -19.5, 0.9, 0, Math.PI * 2);
	ctx.arc(2.5, -20.5, 0.9, 0, Math.PI * 2);
	ctx.fill();


	ctx.fillStyle = '#ea580c';
	ctx.beginPath();
	ctx.moveTo(-1, -23);
	ctx.lineTo(6, -22);
	ctx.lineTo(-1, -21);
	ctx.closePath();
	ctx.fill();


	const scarfSway = Math.sin(time * 3) * 2;
	ctx.fillStyle = '#dc2626';
	roundRect(ctx, -7, -17, 14, 4.5, 2);
	ctx.beginPath();
	ctx.moveTo(3, -15);
	ctx.lineTo(8 + scarfSway, -6);
	ctx.lineTo(4 + scarfSway, -5);
	ctx.lineTo(0, -14);
	ctx.closePath();
	ctx.fill();


	ctx.fillStyle = '#16a34a';
	ctx.fillRect(4 + scarfSway, -6, 4, 2);


	ctx.fillStyle = '#1e293b';
	roundRect(ctx, -9, -32, 18, 3, 1.5);
	roundRect(ctx, -6, -42, 12, 10, 2);
	ctx.fillStyle = '#dc2626';
	ctx.fillRect(-6, -34, 12, 2.5);

	ctx.restore();
}


export function drawCandyCane(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
	scale: number,
) {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.scale(scale, scale);


	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.ellipse(0, 14, 10, 5, 0, 0, Math.PI * 2);
	ctx.fill();


	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';


	ctx.strokeStyle = '#f8fafc';
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.moveTo(0, 12);
	ctx.lineTo(0, -10);
	ctx.arc(-6, -10, 6, 0, Math.PI, true);
	ctx.stroke();


	ctx.strokeStyle = '#dc2626';
	ctx.lineWidth = 6;
	ctx.setLineDash([5, 5]);
	ctx.beginPath();
	ctx.moveTo(0, 12);
	ctx.lineTo(0, -10);
	ctx.arc(-6, -10, 6, 0, Math.PI, true);
	ctx.stroke();
	ctx.setLineDash([]);


	ctx.fillStyle = '#16a34a';
	ctx.beginPath();
	ctx.ellipse(-5, -2, 4, 2.5, -0.4, 0, Math.PI * 2);
	ctx.ellipse(5, -2, 4, 2.5, 0.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#fde047';
	ctx.beginPath();
	ctx.arc(0, -2, 2, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();
}


export function drawGiftBox(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
	scale: number,
	variant: number,
) {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.scale(scale, scale);

	const boxThemes = [
		{ box: '#dc2626', ribbon: '#fde047', lid: '#b91c1c' },
		{ box: '#16a34a', ribbon: '#ef4444', lid: '#15803d' },
		{ box: '#0284c7', ribbon: '#f8fafc', lid: '#0369a1' },
		{ box: '#7c3aed', ribbon: '#fde047', lid: '#6d28d9' },
	];
	const theme = boxThemes[variant % boxThemes.length];


	ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
	ctx.beginPath();
	ctx.ellipse(0, 14, 14, 5, 0, 0, Math.PI * 2);
	ctx.fill();


	ctx.fillStyle = theme.box;
	roundRect(ctx, -11, -4, 22, 17, 3);


	ctx.fillStyle = theme.lid;
	roundRect(ctx, -13, -10, 26, 7, 2.5);


	ctx.fillStyle = theme.ribbon;
	ctx.fillRect(-3, -10, 6, 23);


	ctx.fillRect(-11, 2, 22, 5);


	ctx.beginPath();
	ctx.ellipse(-5, -12, 4.5, 2.8, -0.5, 0, Math.PI * 2);
	ctx.ellipse(5, -12, 4.5, 2.8, 0.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#ffffff';
	ctx.beginPath(); ctx.arc(0, -12, 2, 0, Math.PI * 2); ctx.fill();

	ctx.restore();
}


export function drawSnowflakes(
	ctx: CanvasRenderingContext2D,
	snowflakes: Snowflake[],
	time: number,
	palette: RacingThemePalette,
) {
	ctx.save();
	ctx.fillStyle = palette.snowParticle;
	for (const f of snowflakes) {
		const swayX = f.x + Math.sin(time * f.swaySpeed + f.phase) * f.swayAmp;
		ctx.globalAlpha = f.alpha;
		ctx.beginPath();
		ctx.arc(swayX, f.y, f.r, 0, Math.PI * 2);
		ctx.fill();


		if (f.r > 2.6) {
			ctx.strokeStyle = palette.snowParticle;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(swayX - f.r * 1.5, f.y); ctx.lineTo(swayX + f.r * 1.5, f.y);
			ctx.moveTo(swayX, f.y - f.r * 1.5); ctx.lineTo(swayX, f.y + f.r * 1.5);
			ctx.stroke();
		}
	}
	ctx.restore();
}


export function drawCar(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
	w: number, h: number,
	bodyColor: string,
	windowColor: string,
	detailColor: string,
	isPlayer: boolean,
	alpha = 1,
) {
	ctx.globalAlpha = alpha;
	const x = cx - w / 2;
	const y = cy - h / 2;


	ctx.fillStyle = 'rgba(0,0,0,0.32)';
	ctx.beginPath();
	ctx.ellipse(cx + 4, cy + 8, w * 0.46, h * 0.28, 0, 0, Math.PI * 2);
	ctx.fill();


	ctx.fillStyle = bodyColor;
	roundRect(ctx, x, y, w, h, 10);


	ctx.fillStyle = detailColor;
	roundRect(ctx, x + 6, y + 6, w - 12, 12, 4);


	ctx.fillStyle   = windowColor;
	ctx.globalAlpha = alpha * 0.85;
	roundRect(ctx, x + 7, y + 20, w - 14, h * 0.22, 5);
	roundRect(ctx, x + 7, y + h - 8 - h * 0.18, w - 14, h * 0.18, 5);
	ctx.globalAlpha = alpha;


	ctx.fillStyle = '#111827';
	const wW = 11, wH = 20, wR = 4;
	roundRect(ctx, x - 4,     y + 14,          wW, wH, wR);
	roundRect(ctx, x + w - 7, y + 14,          wW, wH, wR);
	roundRect(ctx, x - 4,     y + h - 14 - wH, wW, wH, wR);
	roundRect(ctx, x + w - 7, y + h - 14 - wH, wW, wH, wR);


	ctx.fillStyle = '#6b7280';
	for (const [rx, ry] of [
		[x + 1.5, y + 24], [x + w - 1.5, y + 24],
		[x + 1.5, y + h - 24], [x + w - 1.5, y + h - 24],
	] as [number, number][]) {
		ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI * 2); ctx.fill();
	}


	if (isPlayer) {

		ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
		roundRect(ctx, x + 3,      y + 2, 14, 10, 3);
		roundRect(ctx, x + w - 17, y + 2, 14, 10, 3);


		ctx.fillStyle = '#38bdf8';
		roundRect(ctx, x + 5,      y + 4, 10, 6, 2);
		roundRect(ctx, x + w - 15, y + 4, 10, 6, 2);


		ctx.fillStyle = '#e0f2fe';
		roundRect(ctx, x + 7,      y + 5, 6, 4, 1);
		roundRect(ctx, x + w - 13, y + 5, 6, 4, 1);
	} else {
		ctx.fillStyle = '#fca5a5';
		roundRect(ctx, x + 5,      y + h - 8, 10, 5, 2);
		roundRect(ctx, x + w - 15, y + h - 8, 10, 5, 2);
	}

	ctx.globalAlpha = 1;
}

export function drawPlayerCar(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
) {
	const baseY = cy - PLAYER_H / 2 + 6;
	const tipY  = cy - PLAYER_H / 2 - 130;


	ctx.save();


	const ambientGrad = ctx.createLinearGradient(cx, baseY, cx, tipY);
	ambientGrad.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
	ambientGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.18)');
	ambientGrad.addColorStop(0.75, 'rgba(2, 132, 199, 0.06)');
	ambientGrad.addColorStop(1, 'rgba(2, 132, 199, 0.0)');

	ctx.fillStyle = ambientGrad;
	ctx.beginPath();
	ctx.moveTo(cx - 24, baseY);
	ctx.lineTo(cx - 52, tipY);
	ctx.lineTo(cx + 52, tipY);
	ctx.lineTo(cx + 24, baseY);
	ctx.closePath();
	ctx.fill();


	const beamGrad = ctx.createLinearGradient(cx, baseY, cx, tipY);
	beamGrad.addColorStop(0, 'rgba(224, 242, 254, 0.75)');
	beamGrad.addColorStop(0.12, 'rgba(56, 189, 248, 0.55)');
	beamGrad.addColorStop(0.45, 'rgba(14, 165, 233, 0.28)');
	beamGrad.addColorStop(0.8, 'rgba(2, 132, 199, 0.08)');
	beamGrad.addColorStop(1, 'rgba(2, 132, 199, 0.0)');

	ctx.fillStyle = beamGrad;


	ctx.beginPath();
	ctx.moveTo(cx - 16, baseY);
	ctx.lineTo(cx - 42, tipY);
	ctx.lineTo(cx - 6,  tipY);
	ctx.closePath();
	ctx.fill();


	ctx.beginPath();
	ctx.moveTo(cx + 16, baseY);
	ctx.lineTo(cx + 6,  tipY);
	ctx.lineTo(cx + 42, tipY);
	ctx.closePath();
	ctx.fill();


	const lampGlow = ctx.createRadialGradient(cx, baseY, 2, cx, baseY, 30);
	lampGlow.addColorStop(0, 'rgba(224, 242, 254, 0.55)');
	lampGlow.addColorStop(0.35, 'rgba(56, 189, 248, 0.28)');
	lampGlow.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
	ctx.fillStyle = lampGlow;
	ctx.beginPath();
	ctx.arc(cx, baseY, 30, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();


	ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
	ctx.beginPath();
	ctx.ellipse(cx, cy + PLAYER_H / 2 - 6, 18, 8, 0, 0, Math.PI * 2);
	ctx.fill();

	drawCar(ctx, cx, cy, PLAYER_W, PLAYER_H,
		COLORS.playerBody, COLORS.playerWin, COLORS.playerDtl, true, 1);


	ctx.save();
	const hoodY = cy - PLAYER_H / 2 + 10;
	ctx.fillStyle = '#16a34a';
	ctx.beginPath();
	ctx.ellipse(cx - 4, hoodY, 3.5, 2, -0.4, 0, Math.PI * 2);
	ctx.ellipse(cx + 4, hoodY, 3.5, 2, 0.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#ef4444';
	ctx.beginPath();
	ctx.arc(cx, hoodY, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}


export function drawBarrier(
	ctx: CanvasRenderingContext2D,
	obs: ObstacleData,
	cx: number,
	time: number,
) {
	const x = cx - OBS_W / 2;
	const y = obs.y;
	const w = OBS_W;
	const h = OBS_H;

	if (obs.state === 'clearing') {
		const a = Math.max(0, obs.flashTimer / 22);
		ctx.save();
		ctx.globalAlpha = a;
		ctx.fillStyle   = '#10b981';
		roundRect(ctx, x + 4, y + h * 0.15, w - 8, h * 0.45, 6);
		ctx.fillStyle = '#fde047';
		ctx.beginPath();
		ctx.arc(cx - 24, y + 10, 4, 0, Math.PI * 2);
		ctx.arc(cx + 24, y + 10, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
		return;
	}

	if (obs.state === 'wrong-flash') {
		const a = 0.5 + 0.5 * Math.abs(Math.sin(obs.flashTimer * 0.55));
		ctx.save();
		ctx.globalAlpha = a;
		ctx.fillStyle   = '#dc2626';
		roundRect(ctx, x + 4, y + h * 0.08, w - 8, h * 0.42, 6);
		roundRect(ctx, x + 10, y + h * 0.60, w - 20, h * 0.28, 5);
		ctx.restore();
		return;
	}

	ctx.save();


	const legW = 6;
	const legTop = y + h * 0.42;
	const legBot = h * 0.58;
	for (const lx of [x + w * 0.18 - legW / 2, x + w * 0.82 - legW / 2]) {
		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(lx, legTop, legW, legBot);
		ctx.fillStyle = '#dc2626';
		for (let ly = legTop; ly < legTop + legBot; ly += 8) {
			ctx.fillRect(lx, ly, legW, 4);
		}
	}


	const bx = x + 4, by = y + h * 0.08, bw = w - 8, bh = h * 0.42;
	ctx.fillStyle = '#ffffff';
	roundRect(ctx, bx, by, bw, bh, 6);

	ctx.save();
	ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.clip();
	const sw = 14;
	ctx.fillStyle = '#dc2626';
	for (let sx = bx - bh; sx < bx + bw + bh; sx += sw * 2) {
		ctx.beginPath();
		ctx.moveTo(sx, by); ctx.lineTo(sx + sw, by);
		ctx.lineTo(sx + sw + bh, by + bh); ctx.lineTo(sx + bh, by + bh);
		ctx.closePath(); ctx.fill();
	}
	ctx.restore();
	ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 1.5;
	ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.stroke();


	const b2x = x + 10, b2y = y + h * 0.60, b2w = w - 20, b2h = h * 0.28;
	ctx.fillStyle = '#ffffff';
	roundRect(ctx, b2x, b2y, b2w, b2h, 5);
	ctx.save();
	ctx.beginPath(); ctx.roundRect(b2x, b2y, b2w, b2h, 5); ctx.clip();
	ctx.fillStyle = '#16a34a';
	for (let sx = b2x - b2h; sx < b2x + b2w + b2h; sx += sw * 2) {
		ctx.beginPath();
		ctx.moveTo(sx, b2y); ctx.lineTo(sx + sw, b2y);
		ctx.lineTo(sx + sw + b2h, b2y + b2h); ctx.lineTo(sx + b2h, b2y + b2h);
		ctx.closePath(); ctx.fill();
	}
	ctx.restore();
	ctx.strokeStyle = '#15803d'; ctx.lineWidth = 1.2;
	ctx.beginPath(); ctx.roundRect(b2x, b2y, b2w, b2h, 5); ctx.stroke();


	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.moveTo(bx - 1, by + 1);
	const numDrips = 6;
	const dripW = (bw + 2) / numDrips;
	for (let d = 0; d < numDrips; d++) {
		const dx = bx - 1 + d * dripW;
		ctx.quadraticCurveTo(dx + dripW / 2, by + 5 + (d % 2) * 2, dx + dripW, by + 1);
	}
	ctx.lineTo(bx + bw + 1, by - 4);
	ctx.quadraticCurveTo(cx, by - 7, bx - 1, by - 4);
	ctx.closePath();
	ctx.fill();


	const bulbColors = ['#f59e0b', '#10b981', '#ef4444', '#38bdf8'];
	const bulbIdx = obs.colorIdx % bulbColors.length;
	const bulbCol = bulbColors[bulbIdx];
	const bulbPulse = 0.8 + 0.2 * Math.sin(time * 5 + obs.id);

	for (const lx of [x + w * 0.18, x + w * 0.82]) {
		ctx.fillStyle = '#64748b';
		ctx.fillRect(lx - 2.5, y + h * 0.08 - 8, 5, 8);
		ctx.globalAlpha = bulbPulse;
		ctx.fillStyle = bulbCol;
		ctx.beginPath(); ctx.arc(lx, y + h * 0.08 - 11, 5.5, 0, Math.PI * 2); ctx.fill();
		ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();
		ctx.fillStyle = '#ffffff';
		ctx.beginPath(); ctx.arc(lx, y + h * 0.08 - 14, 2, 0, Math.PI * 2); ctx.fill();
		ctx.globalAlpha = 1;
	}


	const numLabel = obs.questionText;
	const numFontPx = Math.round(bh * 0.92);
	ctx.font = `900 ${numFontPx}px "Fuzzy Bubbles", sans-serif`;
	const numW = ctx.measureText(numLabel).width;
	const plateW = Math.min(Math.max(54, numW + 26), bw - 8);
	const plateH = Math.min(36, bh * 0.74);
	const plateX = cx - plateW / 2;
	const plateY = by + bh / 2 - plateH / 2 + 1;


	ctx.fillStyle = '#d97706';
	roundRect(ctx, plateX - 3, plateY - 3, plateW + 6, plateH + 6, 9);


	ctx.fillStyle = '#fffbeb';
	roundRect(ctx, plateX, plateY, plateW, plateH, 7);


	ctx.fillStyle = '#dc2626';
	ctx.beginPath();
	ctx.arc(plateX + 6, plateY + 6, 2, 0, Math.PI * 2);
	ctx.arc(plateX + plateW - 6, plateY + 6, 2, 0, Math.PI * 2);
	ctx.fill();


	ctx.fillStyle = '#1e293b';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = `900 ${numFontPx}px "Fuzzy Bubbles", sans-serif`;
	ctx.fillText(numLabel, cx, plateY + plateH / 2 + 1);
	ctx.restore();
}


export function drawClover(
	ctx: CanvasRenderingContext2D,
	cx: number, cy: number,
	r: number,
	time: number,
	collected: boolean,
	collectAnim: number,
) {
	if (collected && collectAnim <= 0) return;
	const scale = collected ? 1 + collectAnim * 1.5 : 1 + Math.sin(time * 2.8) * 0.08;
	const alpha = collected ? collectAnim : 1;

	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.translate(cx, cy);
	ctx.scale(scale, scale);


	ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
	ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();


	ctx.fillStyle = COLORS.clover;
	const lr = r * 0.72;
	const offs: [number, number][] = [[0, -lr], [0, lr], [-lr, 0], [lr, 0]];
	for (const [ox, oy] of offs) {
		ctx.beginPath(); ctx.ellipse(ox, oy, lr * 0.82, lr, 0, 0, Math.PI * 2); ctx.fill();
	}


	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth   = 1.2;
	ctx.globalAlpha = alpha * 0.6;
	for (const [ox, oy] of offs) {
		ctx.beginPath(); ctx.ellipse(ox, oy, lr * 0.82, lr, 0, 0, Math.PI * 2); ctx.stroke();
	}
	ctx.globalAlpha = alpha;


	ctx.strokeStyle = COLORS.cloverDark;
	ctx.lineWidth   = 1.4;
	for (const [ox, oy] of offs) {
		ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ox * 1.2, oy * 1.2); ctx.stroke();
	}


	const berries: [number, number][] = [[-2.5, -1.5], [2.5, -1.5], [0, 2.5]];
	for (const [bx, by] of berries) {
		ctx.fillStyle = '#dc2626';
		ctx.beginPath(); ctx.arc(bx, by, 3.2, 0, Math.PI * 2); ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.beginPath(); ctx.arc(bx - 0.8, by - 0.8, 1, 0, Math.PI * 2); ctx.fill();
	}


	ctx.strokeStyle = COLORS.cloverStem;
	ctx.lineWidth   = 2.2;
	ctx.beginPath();
	ctx.moveTo(0, r * 0.3);
	ctx.quadraticCurveTo(r * 0.5, r * 0.9, r * 0.35, r * 1.35);
	ctx.stroke();
	ctx.restore();
}


export function drawLogoDecal(
	ctx: CanvasRenderingContext2D,
	img: HTMLImageElement,
	cx: number, cy: number,
	size: number,
) {
	if (!img.complete || img.naturalWidth === 0) return;
	ctx.save();
	ctx.globalAlpha = LOGO_OPACITY;
	ctx.translate(cx, cy);
	ctx.rotate(Math.PI / 2);
	ctx.drawImage(img, -size / 2, -size / 2, size, size);
	ctx.restore();
}


export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
	for (const p of particles) {
		const a = p.life / p.maxLife;
		ctx.globalAlpha = a;
		ctx.fillStyle   = p.color;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 1;
}

export function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
	ctx.font      = 'bold 22px system-ui, sans-serif';
	ctx.textAlign = 'center';
	for (const t of texts) {
		const a    = t.life / t.maxLife;
		const rise = (1 - a) * 44;
		ctx.globalAlpha = a;
		ctx.fillStyle   = t.color;
		ctx.fillText(t.text, t.x, t.y - rise);
	}
	ctx.globalAlpha = 1;
}





export function compactInPlace<T>(arr: T[], keep: (item: T) => boolean): T[] {
	let write = 0;
	for (let read = 0; read < arr.length; read++) {
		const item = arr[read];
		if (keep(item)) arr[write++] = item;
	}
	arr.length = write;
	return arr;
}
