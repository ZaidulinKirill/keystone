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
			/>
			<div className="">
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
					<FormField label="Email (почта)" htmlFor="email">
						<FormInput
							autoFocus
							type="email"
							name="email"
							onChange={handleInputChange}
							value={email}
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
					<FormField label="comment (комментарий)" htmlFor="comment">
						<FormInput
							autoFocus
							type="text"
							name="comment"
							multiline
							style={{ height: 130 }}
							numberOfLines={8}
							onChange={handleInputChange}
							value={comment}
					/>
					</FormField>
					<FormField label="Biography (биография)" htmlFor="biography">
						<TinyMCE
							autoFocus
							content={biography}
							config={{
								plugins: 'autolink link image lists print preview',
								toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
								height: 400,
							}}
							onChange={handleInputChange}
						/>
					</FormField>
					<Button disabled={isAnimating} color="primary" type="submit">
					Register
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
