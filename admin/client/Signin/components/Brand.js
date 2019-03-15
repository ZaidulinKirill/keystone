/**
 * Renders a logo, defaulting to the Keystone logo if no brand is specified in
 * the configuration
 */

import React from 'react';

const Brand = function (props) {
	// Default to the KeystoneJS logo
	let logo = { src: `${Keystone.adminPath}/images/logo.png`, width: 205, height: 68 };
	if (props.logo) {
		// If the logo is set to a string, it's a direct link
		logo = typeof props.logo === 'string' ? { src: props.logo } : props.logo;
		// Optionally one can specify the logo as an array, also stating the
		// wanted width and height of the logo
		// TODO: Deprecate this
		if (Array.isArray(logo)) {
			logo = { src: logo[0], width: logo[1], height: logo[2] };
		}
	}
	return (
		<div className={props.fullscreen ? '' : 'auth-box__col'}>
			<div className="auth-box__brand" style={{ border: '0px', backgroundColor: '#323232' }}>
				<a href="/" className="auth-box__brand__logo">
					<img
						src={'http://photo.academart.com/images/5c64229e77e9c607d7a77206'}
						// width={logo.width ? logo.width : null}
						height="70px"
						marginTop="10px"
						alt={props.brand}
					/>
				</a>
				<br />
				<br />
				<a href="/" className="auth-box__brand__logo" fontSize="16px">
					«Academy of Arts» Foundation
				</a>
			</div>
		</div>
	);
};

module.exports = Brand;
