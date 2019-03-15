var _ = require('lodash');
var assign = require('object-assign');
var async = require('async');
var FieldType = require('../Type');
var keystone = require('../../..');
var util = require('util');
var eclainaryTransform = require('../../../lib/eclainaryTransform');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

function getEmptyValue () {
	return {
		public_id: '',
		format: '',
		url: '',
		width: 0,
		height: 0,
	};
}

function truthy (value) {
	return value;
}

/*
* Uses a before and after snapshot of the images array to find out what images are no longer included
*/
function cleanUp (oldValues, newValues) {
};

/**
 * EclainaryImages FieldType Constructor
 */
function eclainaryimages (list, path, options) {
	this._underscoreMethods = ['format'];
	this._fixedSize = 'full';
	this._properties = ['select', 'selectPrefix', 'autoCleanup', 'publicID', 'folder', 'filenameAsPublicID'];

	eclainaryimages.super_.call(this, list, path, options);

	// validate cloudinary config
	if (!keystone.get('eclainary config')) {
		throw new Error('Invalid Configuration\n\n'
			+ 'EclainaryImages fields (' + list.key + '.' + this.path + ') require the "eclainary config" option to be set.\n\n'
			+ 'See http://keystonejs.com/docs/configuration/#services-cloudinary for more information.\n');
	}
}
eclainaryimages.properName = 'EclainaryImages';
util.inherits(eclainaryimages, FieldType);

/**
 * Gets the folder for images in this field
 */
eclainaryimages.prototype.getFolder = function () {
	var folder = null;

	if (keystone.get('eclainary folders') || this.options.folder) {
		if (typeof this.options.folder === 'string') {
			folder = this.options.folder;
		} else {
			folder = this.list.path + '/' + this.path;
		}
	}

	return folder;
};

/**
 * Registers the field on the List's Mongoose Schema.
 */
eclainaryimages.prototype.addToSchema = function (schema) {

	// var cloudinary = require('cloudinary');
	var mongoose = keystone.mongoose;
	var field = this;

	this.paths = {
		// virtuals
		folder: this.path + '.folder',
		// form paths
		upload: this.path + '_upload',
		uploads: this.path + '_uploads',
		action: this.path + '_action',
	};

	var ImageSchema = new mongoose.Schema({
		public_id: String,
		format: String,
		url: String,
		width: Number,
		height: Number,
	});

	// Generate eclainary folder used to upload/select images
	var folder = function (item) { // eslint-disable-line no-unused-vars
		var folderValue = '';

		if (keystone.get('eclainary folders')) {
			if (field.options.folder) {
				folderValue = field.options.folder;
			} else {
				var folderList = keystone.get('eclainary prefix') ? [keystone.get('eclainary prefix')] : [];
				folderList.push(field.list.path);
				folderList.push(field.path);
				folderValue = folderList.join('/');
			}
		}

		return folderValue;
	};

	// The .folder virtual returns the eclainary folder used to upload/select images
	schema.virtual(field.paths.folder).get(function () {
		return folder(this);
	});

	var src = function (img) {
		return `http://photo.academart.com/images/${img.public_id}`;
	};

	ImageSchema.method('src', function (options) {
		return src(this, options);
	});
	ImageSchema.method('transform', function (options, format) {
		return eclainaryTransform(src(this), options, format);
	});

	schema.add(this._path.addTo({}, [ImageSchema]));

	this.removeImage = function (item, id, method, callback) {
		var images = item.get(field.path);
		if (typeof id !== 'number') {
			for (var i = 0; i < images.length; i++) {
				if (images[i].public_id === id) {
					id = i;
					break;
				}
			}
		}
		var img = images[id];
		if (!img) return;
		// if (method === 'delete') {
		// 	cloudinary.uploader.destroy(img.public_id, function () {});
		// }
		images.splice(id, 1);
		if (callback) {
			item.save((typeof callback !== 'function') ? callback : undefined);
		}
	};
	this.underscoreMethod('remove', function (id, callback) {
		field.removeImage(this, id, 'remove', callback);
	});
	this.underscoreMethod('delete', function (id, callback) {
		field.removeImage(this, id, 'delete', callback);
	});
	this.bindUnderscoreMethods();
};

/**
 * Formats the field value
 */
eclainaryimages.prototype.format = function (item) {
	return _.map(item.get(this.path), function (img) {
		return img.src();
	}).join(', ');
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
eclainaryimages.prototype.getData = function (item) {
	var value = item.get(this.path);
	return Array.isArray(value) ? value : [];
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
eclainaryimages.prototype.inputIsValid = function (data) { // eslint-disable-line no-unused-vars
	// TODO - how should image field input be validated?
	return true;
};


eclainaryimages.prototype._originalGetOptions = eclainaryimages.prototype.getOptions;

eclainaryimages.prototype.getOptions = function () {
	this._originalGetOptions();
	// We are performing the check here, so that if cloudinary secure is added
	// to keystone after the model is registered, it will still be respected.
	// Setting secure overrides default `cloudinary secure`
	if ('secure' in this.options) {
		this.__options.secure = this.options.secure;
	} else if (keystone.get('eclainary secure')) {
		this.__options.secure = keystone.get('eclainary secure');
	}
	return this.__options;
};

/**
 * Updates the value for this field in the item from a data object
 */
eclainaryimages.prototype.updateItem = function (item, data, files, callback) {
	if (typeof files === 'function') {
		callback = files;
		files = {};
	} else if (!files) {
		files = {};
	}

	// var cloudinary = require('cloudinary');
	var field = this;
	var values = this.getValueFromData(data);
	var oldValues = item.get(this.path);

	// TODO: This logic needs to block uploading of files from the data argument,
	// see CloudinaryImage for a reference on how it should be implemented

	// Early exit path: reset value when falsy, or bail if no value was provided
	if (!values) {
		if (values !== undefined) {
			if (field.options.autoCleanup) {
				cleanUp(oldValues, []);
			}
			item.set(field.path, []);
		}
		return process.nextTick(callback);
	}

	// When the value exists, but isn't an array, turn it into one (this just
	// means a single field was submitted in the formdata)
	if (!Array.isArray(values)) {
		values = [values];
	}

	// We cache options to avoid recalculating them on each iteration in the map below
	// var cachedUploadOptions;
	// function getUploadOptions () {
	// 	if (cachedUploadOptions) {
	// 		return cachedUploadOptions;
	// 	}
	// 	var tagPrefix = keystone.get('eclainary prefix') || '';
	// 	var uploadOptions = {
	// 		tags: [],
	// 	};
	// 	if (tagPrefix.length) {
	// 		uploadOptions.tags.push(tagPrefix);
	// 		tagPrefix += '_';
	// 	}
	// 	uploadOptions.tags.push(tagPrefix + field.list.path + '_' + field.path);
	// 	if (keystone.get('env') !== 'production') {
	// 		uploadOptions.tags.push(tagPrefix + 'dev');
	// 	}
	// 	var folder = field.getFolder();
	// 	if (folder) {
	// 		uploadOptions.folder = folder;
	// 	}
	// 	cachedUploadOptions = uploadOptions;
	// 	return uploadOptions;
	// }

	// Preprocess values to deserialise JSON, detect mappings to uploaded files
	// and flatten out arrays
	values = values.map(function (value) {
		// When the value is a string, it may be JSON serialised data.
		if (typeof value === 'string'
			&& value.charAt(0) === '{'
			&& value.charAt(value.length - 1) === '}'
		) {
			try {
				return JSON.parse(value);
			} catch (e) { /* value isn't JSON */ }
		}
		if (typeof value === 'string') {
			// detect file upload (field value must be a reference to a field in the
			// uploaded files object provided by multer)
			if (value.substr(0, 7) === 'upload:') {
				var uploadFieldPath = value.substr(7);
				return files[uploadFieldPath];
			}
			// detect a URL or Base64 Data
			else if (/^(data:[a-z\/]+;base64)|(https?\:\/\/)/.test(value)) {
				return { path: value };
			}
		}
		return value;
	});
	values = _.flatten(values);

	async.map(values, function (value, next) {
		if (typeof value === 'object' && 'public_id' in value) {
			// Cloudinary Image data provided
			if (value.public_id) {
				// Default the object with empty values
				var v = assign(getEmptyValue(), value);
				return next(null, v);
			} else {
				// public_id is falsy, remove the value
				return next();
			}
		} else if (typeof value === 'object' && value.path) {
			// File provided - upload it
			// var uploadOptions = getUploadOptions();
			// // NOTE: field.options.publicID has been deprecated (tbc)
			// if (field.options.filenameAsPublicID && value.originalname && typeof value.originalname === 'string') {
			// 	uploadOptions = assign({}, uploadOptions, {
			// 		public_id: value.originalname.substring(0, value.originalname.lastIndexOf('.')),
			// 	});
			// }

			var formData = new FormData();

			formData.append('file', fs.createReadStream(value.path), {
				filename: value.originalname,
			});

			fetch(`${process.env.ECLAINARY_URL}/images/${process.env.ECLAINARY_TOKEN}`,
			{ method: 'POST', body: formData })
				.then(function (res) {
					return res.json();
				})
				.then(function (res) {
					next(null, res);
				})
				.catch(function (err) {
					console.error(err);
					next(err);
				});
		} else {
			// Nothing to do
			// TODO: We should really also support deleting images from cloudinary,
			// see the CloudinaryImageType field for reference
			return next();
		}
	}, function (err, result) {
		cleanUp(oldValues, values);
		if (err) return callback(err);
		result = result.filter(truthy);
		item.set(field.path, result);
		return callback();
	});
};

module.exports = eclainaryimages;
