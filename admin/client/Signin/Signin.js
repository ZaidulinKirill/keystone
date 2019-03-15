/**
 * The actual Sign In view, with the login form
 */

import assign from 'object-assign';
import classnames from 'classnames';
import React from 'react';
import xhr from 'xhr';

import Alert from './components/Alert';
import Brand from './components/Brand';
import UserInfo from './components/UserInfo';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import SignupSuccess from './components/SignupSuccess';

var SigninView = React.createClass({
	getInitialState () {
		return {
			firstName: '',
			secondName: '',
			biography: '',
			email: '',
			comment: '',
			password: '',
			isAnimating: false,
			isInvalid: false,
			invalidMessage: '',
			signedOut: window.location.search === '?signedout',
			isSignupCompleted: false,
		};
	},
	componentDidMount () {
		// Focus the email field when we're mounted
		if (this.refs.email) {
			this.refs.email.select();
		}
	},
	handleInputChange (e) {
		// Set the new state when the input changes
		const newState = {};
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	},
	handleSubmit (e) {
		e.preventDefault();
		// If either password or mail are missing, show an error
		if (!this.state.email || !this.state.password) {
			return this.displayError('Please enter an email address and password to sign in.');
		}

		xhr({
			url: `${Keystone.adminPath}/api/session/signin`,
			method: 'post',
			json: {
				email: this.state.email,
				password: this.state.password,
			},
			headers: assign({}, Keystone.csrf.header),
		}, (err, resp, body) => {
			if (err || body && body.error) {
				return body.error === 'invalid csrf'
					? this.displayError('Something went wrong; please refresh your browser and try again.')
					: this.displayError('The email and password you entered are not valid.');
			} else {
				// Redirect to where we came from or to the default admin path
				if (Keystone.redirect) {
					top.location.href = Keystone.redirect;
				} else {
					top.location.href = this.props.from ? this.props.from : Keystone.adminPath;
				}
			}
		});
	},
	handleSignupSubmit (e) {
		e.preventDefault();
		console.log(this.state);
		if (!this.state.email || !this.state.password || !this.state.firstName || !this.state.secondName
				|| !this.state.biography) {
			return this.displayError(
				`Please enter all information about yourself. Пожалуйста, введите всю информацию о себе.`
			);
		}

		xhr({
			url: `/api/signup`,
			method: 'post',
			json: {
				firstName: this.state.firstName,
				secondName: this.state.secondName,
				email: this.state.email,
				password: this.state.password,
				biography: this.state.biography,
				comment: this.state.comment,
			},
			headers: assign({}, Keystone.csrf.header),
		}, (err, resp, body) => {
			if (err || body && body.error) {
				return body.error === 'invalid csrf'
					? this.displayError('Something went wrong; please refresh your browser and try again.')
					: this.displayError(body.error);
			} else {
				this.setState({ isSignupCompleted: true });
			}
		});
	},
	/**
	 * Display an error message
	 *
	 * @param  {String} message The message you want to show
	 */
	displayError (message) {
		this.setState({
			isAnimating: true,
			isInvalid: true,
			invalidMessage: message,
		});
		setTimeout(this.finishAnimation, 750);
	},
	// Finish the animation and select the email field
	finishAnimation () {
		// TODO isMounted was deprecated, find out if we need this guard
		if (!this.isMounted()) return;
		if (this.refs.email) {
			this.refs.email.select();
		}
		this.setState({
			isAnimating: false,
		});
	},
	render () {
		const boxClassname = classnames('auth-box', {
			'auth-box--has-errors': this.state.isAnimating,
		});

		if (this.state.isSignupCompleted) {
			return (<div className="auth-wrapper">
				<div className={boxClassname}>
					<SignupSuccess
						logo={this.props.logo}
						brand={this.props.brand}
						/>
				</div>
				<div className="auth-footer">
					<span>Powered by </span>
					<a href="http://keystonejs.com" target="_blank" title="The Node.js CMS and web application platform (new window)">KeystoneJS</a>
				</div>
			</div>);
		}
		else if (!window.location.search || !window.location.search.includes('register=true')) {
			return (
				<div className="auth-wrapper">
					<Alert
						isInvalid={this.state.isInvalid}
						signedOut={this.state.signedOut}
						invalidMessage={this.state.invalidMessage}
					/>
					<div className={boxClassname}>
						<h1 className="u-hidden-visually">{this.props.brand ? this.props.brand : 'Keystone'} Sign In </h1>
						<div className="auth-box__inner" style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
						}}>
							<Brand
								logo={this.props.logo}
								brand={this.props.brand}
							/>
							{this.props.user ? (
								<UserInfo
									adminPath={this.props.from ? this.props.from : Keystone.adminPath}
									signoutPath={`${Keystone.adminPath}/signout`}
									userCanAccessKeystone={this.props.userCanAccessKeystone}
									userName={this.props.user.name}
								/>
							) : (
								<LoginForm
									email={this.state.email}
									handleInputChange={this.handleInputChange}
									handleSubmit={this.handleSubmit}
									isAnimating={this.state.isAnimating}
									password={this.state.password}
								/>
							)}
							<div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
								Not registered yet? Sign up <a href="/keystone/signin?register=true"> here</a>!
							</div>
						</div>
					</div>
					<div className="auth-footer">
						<span>Powered by </span>
						<a href="http://keystonejs.com" target="_blank" title="The Node.js CMS and web application platform (new window)">KeystoneJS</a>
					</div>
				</div>
			);
		} else {
			return (
				<div className="auth-wrapper">
					<Alert
						isInvalid={this.state.isInvalid}
						signedOut={this.state.signedOut}
						invalidMessage={this.state.invalidMessage}
					/>
					<div className={boxClassname}>
						<h1 className="u-hidden-visually">{this.props.brand ? this.props.brand : 'Keystone'} Sign In </h1>
						<SignupForm
							logo={this.props.logo}
							brand={this.props.brand}
							firstName={this.state.firstName}
							secondName={this.state.secondName}
							email={this.state.email}
							biography={this.state.biography}
							comment={this.state.comment}
							handleInputChange={this.handleInputChange}
							handleSubmit={this.handleSignupSubmit}
							isAnimating={this.state.isAnimating}
							password={this.state.password}
						/>
					</div>
					<div className="auth-footer">
						<span>Powered by </span>
						<a href="http://keystonejs.com" target="_blank" title="The Node.js CMS and web application platform (new window)">KeystoneJS</a>
					</div>
				</div>
			);
		}
	},
});


module.exports = SigninView;
