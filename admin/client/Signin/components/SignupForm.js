/**
 * The login form of the signin screen
 */

import React, { PropTypes } from 'react';
import { Button, Form, FormField, FormInput } from '../../App/elemental';

const SignupForm = ({
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
		<div className="auth-box__col">
			<Form onSubmit={handleSubmit} noValidate>
				<FormField label="First name (имя)" htmlFor="firstName">
					<FormInput
						autoFocus
						type="text"
						name="firstName"
						onChange={handleInputChange}
						value={firstName}
					/>
				</FormField>
				<FormField label="Second name (фамилия)" htmlFor="secondName">
					<FormInput
						autoFocus
						type="text"
						name="secondName"
						onChange={handleInputChange}
						value={secondName}
					/>
				</FormField>
				<FormField label="Email" htmlFor="email">
					<FormInput
						autoFocus
						type="email"
						name="email"
						onChange={handleInputChange}
						value={email}
					/>
				</FormField>
				<FormField label="Biography (биография)" htmlFor="biography">
					<FormInput
						autoFocus
						type="text"
						name="biography"
						onChange={handleInputChange}
						value={biography}
					/>
				</FormField>
				<FormField label="comment (комментарий)" htmlFor="comment">
					<FormInput
						autoFocus
						type="text"
						name="comment"
						onChange={handleInputChange}
						value={comment}
					/>
				</FormField>
				<FormField label="Password" htmlFor="password">
					<FormInput
						type="password"
						name="password"
						onChange={handleInputChange}
						value={password}
					/>
				</FormField>
				<Button disabled={isAnimating} color="primary" type="submit">
					Register
				</Button>
			</Form>
		</div>
	);
};

SignupForm.propTypes = {
	biography: PropTypes.string,
	comment: PropTypes.string,
	email: PropTypes.string,
	firstName: PropTypes.string,
	handleInputChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	isAnimating: PropTypes.bool,
	password: PropTypes.string,
	secondName: PropTypes.string,
};


module.exports = SignupForm;
