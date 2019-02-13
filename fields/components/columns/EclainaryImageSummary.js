import React from 'react';
import eclainaryTransform from '../../../lib/eclainaryTransform';

const IMAGE_SIZE = 100;

const linkStyle = {
	marginRight: 8,
};
const boxStyle = {
	borderRadius: 3,
	display: 'inline-block',
	// height: IMAGE_SIZE,
	overflow: 'hidden',
	verticalAlign: 'middle',
	width: IMAGE_SIZE,
};
const imageStyle = {
	display: 'block',
	maxWidth: IMAGE_SIZE,
	maxHeight: IMAGE_SIZE,
	left: '50%',
	position: 'relative',

	WebkitTransform: 'translateX(-50%)',
	MozTransform: 'translateX(-50%)',
	msTransform: 'translateX(-50%)',
	transform: 'translateX(-50%)',
};
const textStyle = {
	color: '#888',
	display: 'inline-block',
	fontSize: '.8rem',
	marginLeft: 8,
	verticalAlign: 'middle',
};

var EclainaryImageSummary = React.createClass({
	displayName: 'EclainaryImageSummary',
	propTypes: {
		image: React.PropTypes.object.isRequired,
		label: React.PropTypes.oneOf(['dimensions', 'publicId']),
	},
	renderLabel () {
		if (!this.props.label) return;

		const { label, image } = this.props;

		let text;
		if (label === 'dimensions') {
			text = `${image.width} × ${image.height}`;
		} else {
			text = `${image.public_id}.${image.format}`;
		}

		return (
			<span style={textStyle}>
				{text}
			</span>
		);
	},
	renderImageThumbnail () {
		if (!this.props.image) return;

		const url = eclainaryTransform(this.props.image.url, `h_${IMAGE_SIZE},w_${IMAGE_SIZE},c_inside`);
		return <img src={url} style={imageStyle} className="img-load" />;
	},
	render () {
		return (
			<span style={linkStyle}>
				<span style={boxStyle}>
					{this.renderImageThumbnail()}
				</span>
				{this.renderLabel()}
			</span>
		);
	},
});

module.exports = EclainaryImageSummary;
