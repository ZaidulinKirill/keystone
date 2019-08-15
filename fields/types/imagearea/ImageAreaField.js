/*
TODO: CloudinaryImageType actally supports 'remove' and 'reset' actions, but
this field will only submit `""` when 'remove' is clicked. @jossmac we need to
work out whether we're going to support deleting through the UI.
*/

import React, { PropTypes } from 'react';
import Field from '../Field';
import eclainaryTransform from '../../../lib/eclainaryTransform';
import { FormField, FormNote, FormInput } from '../../../admin/client/App/elemental';

import ImageThumbnail from '../../components/ImageThumbnail';
import FileChangeMessage from '../../components/FileChangeMessage';
import Modal from 'react-responsive-modal';
import ReactCrop from 'react-image-crop';

const buildInitialState = (props) => {
	let parts = props.value.split(',');
	let crop = {
		x: parts[0] ? parseFloat(parts[0]) : 0,
		y: parts[1] ? parseFloat(parts[1]) : 0,
		width: parts[2] ? parseFloat(parts[2]) : 0.25,
		height: parts[3] ? parseFloat(parts[3]) : 0.25,
		aspect: props.param.ratio,
	};

	return {
		removeExisting: false,
		isCropChanged: false,
		aspectRatio: props.param.ratio,
		crop: crop,
		dirtyCrop: crop,
		cropValue: `${crop.x},${crop.y},${crop.width},${crop.height}`,
	};
};


module.exports = Field.create({
	propTypes: {
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		param: PropTypes.string,
		path: PropTypes.string.isRequired,
		value: PropTypes.shape({
			x: PropTypes.number,
			y: PropTypes.number,
			width: PropTypes.number,
			height: PropTypes.number,
		}),
	},
	displayName: 'ImageAreaField',
	statics: {
		type: 'ImageArea',
		getDefaultValue: () => ({}),
	},
	getInitialState () {
		return buildInitialState(this.props);
	},
	componentWillReceiveProps (nextProps) {
		// console.log('ImageAreaField nextProps:', nextProps);
	},
	componentWillUpdate (nextProps) {

	},

	// ==============================
	// HELPERS
	// ==============================

	hasExisting () {
		return !!(this.props.param.imagePath && this.props.values[this.props.param.imagePath]);
	},
	getImageSource (height = 90, showArea) {
		let image = this.props.values[this.props.param.imagePath];
		let src;
		if (image && this.hasExisting()) {
			if (!showArea || !this.state.dirtyCrop) {
				src = eclainaryTransform(image.url, 'c_fit,h_' + height);
			}
			else {
				const h = parseFloat(this.state.dirtyCrop.width) / parseFloat(this.state.aspectRatio);
				src = eclainaryTransform(image.url,
					`cx_${(parseFloat(this.state.dirtyCrop.x) / 100).toFixed(5)},cy_${(parseFloat(this.state.dirtyCrop.y) / 100).toFixed(5)},cw_${(parseFloat(this.state.dirtyCrop.width) / 100).toFixed(5)},ch_${(parseFloat(h) / 100).toFixed(5)},` + 'h_' + height);
			}
		}

		return src;
	},

	// ==============================
	// METHODS
	// ==============================

	// Toggle the lightbox
	openLightbox (event) {
		event.preventDefault();

		let { param } = this.props;

		this.setState({
			lightboxIsVisible: true,
			crop: this.state.crop,
		});
	},
	closeLightbox () {
		let { crop } = this.state;

		console.log(crop);
		this.props.onChange({
			path: this.props.path,
			value: {
				x: Number.parseFloat(crop.x),
				y: Number.parseFloat(crop.y),
				width: Number.parseFloat(crop.width),
				height: Number.parseFloat(crop.height),
			},
		});

		this.setState({
			lightboxIsVisible: false,
			isCropChanged: true,
			dirtyCrop: crop,
			cropValue: `${crop.x},${crop.y},${crop.width},${crop.height}`,
		});
	},

	onCropChange (crop) {
		this.setState({ crop, isCropChanged: true });
	},

	// If we have a local file added then remove it and reset the file field.
	handleRemove (e) {
		var state = {};

		if (this.state.userSelectedFile) {
			state.userSelectedFile = null;
		} else if (this.hasExisting()) {
			state.removeExisting = true;
		}

		this.setState(state);
	},
	undoRemove () {
		this.setState(buildInitialState(this.props));
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderLightbox () {
		if (!this.hasExisting()) return;

		return (
			<Modal classNames={{ modal: 'image-area' }} open={this.state.lightboxIsVisible} onClose={this.closeLightbox} center>
				<ReactCrop
					src={this.getImageSource(600)}
					crop={this.state.crop}
					onChange={this.onCropChange}
          />
			</Modal>
		);
	},
	renderImagePreview () {
		return (
			<ImageThumbnail
				component="a"
				href={this.getImageSource(600)}
				onClick={this.openLightbox}
				target="__blank"
				style={{ float: 'left', marginRight: '1em' }}
			>
				<img src={this.getImageSource(90, true)} style={{ height: 90 }} />
			</ImageThumbnail>
		);
	},
	renderChangeMessage () {
		if (this.state.isCropChanged) {
			return (
				<FileChangeMessage color="success">
					Сохраните для загрузки
				</FileChangeMessage>
			);
		} else {
			return null;
		}
	},

	renderUI () {
		const { label, note, path } = this.props;

		const imageContainer = (
			<div style={this.hasExisting() ? { marginBottom: '1em' } : null}>
				{this.hasExisting() && this.renderImagePreview()}
			</div>
		);

		return (
			<FormField label={label} className="field-type-cloudinaryimage" htmlFor={path}>
				<FormInput {...{
					autoComplete: 'off',
					name: this.getInputName(this.props.path),
					onChange: this.valueChanged,
					ref: 'focusTarget',
					type: 'hidden',
					value: `${this.state.cropValue}`,
				}} />

				{imageContainer}
				{this.renderChangeMessage()}
				{!!note && <FormNote note={note} />}
				{this.renderLightbox()}
			</FormField>
		);
	},
});

