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
import './ResultIllustration.scss';

interface ResultIllustrationProps {
	className?: string;
}


export function ResultIllustration({ className }: ResultIllustrationProps) {
	return (
		<div className={`${'resultIllustration-wrap'} ${className || ''}`} aria-hidden="true">
			<svg viewBox="0 0 440 310" className={'resultIllustration-svg'} focusable="false">
				<defs>
					{}
					<radialGradient id="riGlow" cx="50%" cy="45%" r="50%">
						<stop offset="0%" stopColor="#ffd84d" stopOpacity="0.38" />
						<stop offset="55%" stopColor="#ff9900" stopOpacity="0.14" />
						<stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
					</radialGradient>

					{}
					<linearGradient id="riGold" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#fff3a0" />
						<stop offset="40%" stopColor="#ffd84d" />
						<stop offset="100%" stopColor="#e8920c" />
					</linearGradient>

					{}
					<linearGradient id="riGoldDark" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#f7b733" />
						<stop offset="100%" stopColor="#c86a00" />
					</linearGradient>

					{}
					<linearGradient id="riShine" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
						<stop offset="50%" stopColor="#ffffff" stopOpacity="0.62" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
					</linearGradient>

					{}
					<linearGradient id="riCrown" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#fffde0" />
						<stop offset="60%" stopColor="#ffd84d" />
						<stop offset="100%" stopColor="#d97706" />
					</linearGradient>

					{}
					<linearGradient id="riRibbonL" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#f43f5e" />
						<stop offset="100%" stopColor="#e11d48" />
					</linearGradient>

					{}
					<linearGradient id="riRibbonR" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#3b82f6" />
						<stop offset="100%" stopColor="#1d4ed8" />
					</linearGradient>

					{}
					<radialGradient id="riRay" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#ffd84d" stopOpacity="0.50" />
						<stop offset="100%" stopColor="#ffd84d" stopOpacity="0" />
					</radialGradient>
				</defs>

				{}
				<ellipse cx="220" cy="148" rx="135" ry="110" fill="url(#riGlow)" />


				{}
				<ellipse cx="220" cy="234" rx="80" ry="9" fill="#000000" opacity="0.12" />

				{}
				<g className={'resultIllustration-floatB'}>
					<g transform="translate(104 74) scale(1.0) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#ffd700" />
					</g>
					<g transform="translate(348 88) scale(0.82) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#11F3FF" />
					</g>
				</g>

				<g className={'resultIllustration-floatC'}>
					<g transform="translate(76 190) scale(0.72) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#c084fc" />
					</g>
					<g transform="translate(374 194) scale(0.90) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#34d399" />
					</g>
				</g>

				<g className={'resultIllustration-floatD'}>
					<g transform="translate(220 46) scale(0.78) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#ffd700" />
					</g>
					<g transform="translate(376 44) scale(0.62) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#fb7185" />
					</g>
					<g transform="translate(42 154) scale(0.56) translate(-12 -12)">
						<path className={'resultIllustration-sparkle'} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#fbbf24" />
					</g>
				</g>

				{}
				<g className={'resultIllustration-trophyEntrance'}>
					<g className={'resultIllustration-floatTrophy'}>
						{}
						<path d="M168 150 L155 186 L168 179 L178 200 L168 150 Z" fill="url(#riRibbonL)" stroke="#be123c" strokeWidth="1.5" strokeLinejoin="round" />
						<path d="M272 150 L285 186 L272 179 L262 200 L272 150 Z" fill="url(#riRibbonR)" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round" />

						{}
						<path d="M178 108 C 146 112, 138 142, 164 150" fill="none" stroke="url(#riGold)" strokeWidth="10" strokeLinecap="round" />
						<path d="M262 108 C 294 112, 302 142, 276 150" fill="none" stroke="url(#riGold)" strokeWidth="10" strokeLinecap="round" />

						{}
						<path d="M174 100 C 174 146, 196 164, 220 164 C 244 164, 266 146, 266 100 Z" fill="url(#riGold)" stroke="#d97706" strokeWidth="3" strokeLinejoin="round" />

						{}
						<ellipse cx="220" cy="100" rx="47" ry="12" fill="#fff3a0" stroke="#d97706" strokeWidth="3" />

						{}
						<path
							className={'resultIllustration-sparkle'}
							d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"
							fill="#ffffff"
							transform="translate(220 128) scale(0.88) translate(-12 -12)"
						/>

						{}
						<ellipse className={'resultIllustration-trophyShine'} cx="205" cy="118" rx="14" ry="30" fill="url(#riShine)" />

						{}
						<rect x="212" y="164" width="16" height="30" rx="6" fill="url(#riGold)" stroke="#d97706" strokeWidth="2" />
						<rect x="190" y="194" width="60" height="16" rx="8" fill="url(#riGold)" stroke="#d97706" strokeWidth="2" />
						<rect x="172" y="210" width="96" height="22" rx="11" fill="url(#riGoldDark)" stroke="#c2740a" strokeWidth="2" />

						{}
						<g className={'resultIllustration-crownFloat'}>
							{}
							<rect x="192" y="80" width="56" height="14" rx="5" fill="url(#riCrown)" stroke="#d97706" strokeWidth="1.5" />
							{}
							<polygon points="196,80 202,60 208,80" fill="url(#riCrown)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
							<polygon points="217,80 220,54 223,80" fill="url(#riCrown)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
							<polygon points="232,80 238,60 244,80" fill="url(#riCrown)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
							{}
							<circle cx="202" cy="60" r="3.5" fill="#fff" stroke="#f59e0b" strokeWidth="1.2" />
							<circle cx="220" cy="54" r="4"   fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.2" />
							<circle cx="238" cy="60" r="3.5" fill="#fff" stroke="#f59e0b" strokeWidth="1.2" />
							{}
							<circle cx="207" cy="87" r="2.5" fill="#f43f5e" />
							<circle cx="220" cy="87" r="3"   fill="#fbbf24" />
							<circle cx="233" cy="87" r="2.5" fill="#3b82f6" />
						</g>
					</g>
				</g>

				{}
				<text
					x="428"
					y="302"
					textAnchor="end"
					fontSize="7"
					fontFamily="sans-serif"
					fontWeight="700"
					letterSpacing="0.08em"
					fill="rgba(255,200,60,0.22)"
				>
					TNQ
				</text>
			</svg>
		</div>
	);
}
