/**
 * The login form of the signin screen
 */

import React, { PropTypes } from 'react';
import Brand from './Brand';

const SignupSuccess = ({
	logo,
	brand,
}) => {
	return (
		<div className="">
			<Brand
				logo={logo}
				brand={brand}
			/>
			<div className="">
				<h3>Your application has been successfully accepted! (Ваша заявка на регистрацию успешно принята!)</h3>
				<p>Please wait for the verification result. You will be notified with email message. (Пожалуйста, ожидайте результатов проверки. Вы будете уведомлены через электронную почту)</p>
			</div>
		</div>
	);
};

SignupSuccess.propTypes = {
	brand: PropTypes.string,
	logo: PropTypes.string,
};


module.exports = SignupSuccess;
