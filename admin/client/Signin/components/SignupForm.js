/**
 * The login form of the signin screen
 */

import React, { PropTypes } from 'react';
import { Button, Form, FormField, FormInput } from '../../App/elemental';
import Brand from './Brand';
import TinyMCE from 'react-tinymce';

const SignupForm = ({
	logo,
	brand,
	firstName,
	secondName,
	email,
	biography,
	comment,
	handleInputChange,
	handleSubmit,
	isAnimating,
	password,
}) => {
	return (
		<div className="">
			<Brand
				logo={logo}
				brand={brand}
				fullscreen
			/>
			<div className="">
				<Form onSubmit={handleSubmit} noValidate>
					<FormField label="First name (Имя)" htmlFor="firstName">
						<FormInput
							autoFocus
							type="text"
							name="firstName"
							onChange={handleInputChange}
							value={firstName}
					/>
					</FormField>
					<FormField label="Second name (Фамилия)" htmlFor="secondName">
						<FormInput
							autoFocus
							type="text"
							name="secondName"
							onChange={handleInputChange}
							value={secondName}
					/>
					</FormField>
					<FormField label="Email (Почта)" htmlFor="email">
						<FormInput
							autoFocus
							type="email"
							name="email"
							onChange={handleInputChange}
							value={email}
					/>
					</FormField>
					<FormField label="Password (Пароль)" htmlFor="password">
						<FormInput
							type="password"
							name="password"
							onChange={handleInputChange}
							value={password}
					/>
					</FormField>
					<FormField label="Comment (Комментарий)" htmlFor="comment">
						<FormInput
							autoFocus
							type="text"
							name="comment"
							multiline
							style={{ height: 130 }}
							onChange={handleInputChange}
							value={comment}
					/>
					</FormField>
					<FormField label="Biography (Биография)" htmlFor="biography">
						<TinyMCE
							autoFocus
							content={biography}
							config={{
								plugins: 'autolink link image lists print preview',
								toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
								height: 400,
							}}
							onChange={e => handleInputChange({
								target: {
									name: 'biography',
									value: e.target.getContent(),
								},
							})}
						/>
					</FormField>
					<Button disabled={isAnimating} color="primary" type="submit">
					Register (Регистрация)
				</Button>
				</Form>
			</div>
		</div>
	);
};

SignupForm.propTypes = {
	biography: PropTypes.string,
	brand: PropTypes.string,
	comment: PropTypes.string,
	email: PropTypes.string,
	firstName: PropTypes.string,
	handleInputChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	isAnimating: PropTypes.bool,
	logo: PropTypes.string,
	password: PropTypes.string,
	secondName: PropTypes.string,
};


module.exports = SignupForm;