/**
 * The login form of the signin screen
 */

import React, { PropTypes } from 'react';
import Brand from './Brand';
import { Button, Form, FormField, FormInput } from '../../App/elemental';

const SignupSuccess = ({
	logo,
	brand,
}) => {
	return (
		<div className="">
			<Brand
				logo={logo}
				brand={brand}
				fullscreen
			/>
			<div className="">
				<Form>
					<h3 style={{
						textAlign: 'justify',
					}}>Your application has been successfully accepted! (Ваша заявка на регистрацию успешно принята!)</h3>
					<p style={{
						textAlign: 'justify',
					}}>Please wait for the verification result. You will be notified with email message. (Пожалуйста, ожидайте результатов проверки. Вы будете уведомлены через электронную почту)</p>
					<Button color="primary" type="submit" onClick={() => { window.location = '/'; }}>
					Back (Назад)
					</Button>
				</Form>
			</div>
		</div>
	);
};

SignupSuccess.propTypes = {
	brand: PropTypes.string,
	logo: PropTypes.string,
};


module.exports = SignupSuccess;
