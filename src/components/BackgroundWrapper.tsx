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
import '../styles/global.scss';
import './BackgroundWrapper.scss';

interface BackgroundWrapperProps {
	children: React.ReactNode;
	carDelays: number[];
	carPositions: number[];
	transitionKey?: string;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
	children,
}) => {
	return (
		<div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
			{}
			<div
				className={'backgroundWrapper-background'}
				style={{
					position: 'absolute',
					inset: 0,
					zIndex: 0,
				}}
			/>

			{}
			<div
				className={'gamingScrollbar'}
				style={{
					position: 'absolute',
					inset: 0,
					zIndex: 2,
					overflowY: 'auto',
				}}
			>
				<div className={'backgroundWrapper-scrollInner'}>
					{children}
				</div>
			</div>
		</div>
	);
};
