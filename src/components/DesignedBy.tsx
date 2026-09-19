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
import './DesignedBy.scss';

interface DesignedByProps {
	animated?: boolean;
	inline?: boolean;
}

export const DesignedBy: React.FC<DesignedByProps> = ({ animated = false, inline = false }) => {
	if (animated) {
		return (
			<div
				className={`${'designedBy-signature'} ${inline ? 'designedBy-signatureInline' : ''}`}
				aria-label="Happy Number (Open Source Project)"
			>
				<span className={'designedBy-mushroomPeek'} aria-hidden="true"><i /><b /></span>
				<span className={'designedBy-wordmark'} aria-hidden="true"><i>H</i><i>N</i></span>
				<span className={'designedBy-domain'}>Happy Number (Open Source Project)</span>
				<span className={'designedBy-sparkles'} aria-hidden="true">✦ <i>✧</i></span>
			</div>
		);
	}

	return (
		<div className={'designedBy-wrapper'}>
			<div className={'designedBy-mainContent'}>
				<div>
					<p className={'designedBy-label'}>Happy Number (Open Source Project)</p>
				</div>
			</div>
		</div>
	);
};
