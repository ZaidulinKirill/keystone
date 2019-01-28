// var _ = require('lodash');
// var assign = require('object-assign');
// var FieldType = require('../Type');
// var util = require('util');
// var utils = require('keystone-utils');

// /*
// var IMAGEAREA_FIELDS = ['x', 'y', 'width', 'height'];
// */

// var DEFAULT_OPTIONS = {
// };

// function getEmptyValue () {
// 	return {
// 		x: 0,
// 		y: 0,
// 		width: 0.25,
// 		height: 0.25,
// 	};
// }

// /**
//  * ImageArea FieldType Constructor
//  * @extends Field
//  * @api public
//  */
// function imagearea (list, path, options) {
// 	this._underscoreMethods = ['format'];
// 	this._fixedSize = 'full';
// 	this._properties = ['select', 'selectPrefix', 'autoCleanup'];

// 	options = assign({}, DEFAULT_OPTIONS, options);

// 	imagearea.super_.call(this, list, path, options);
// }
// imagearea.properName = 'ImageArea';
// util.inherits(imagearea, FieldType);

// /**
//  * Registers the field on the List's Mongoose Schema.
//  */
// imagearea.prototype.addToSchema = function (schema) {

// 	var field = this;

// 	this.paths = {
// 		x: this.path + '.x',
// 		y: this.path + '.y',
// 		width: this.path + '.width',
// 		height: this.path + '.height',
// 		// form paths
// 		select: this.path + '_select',
// 	};

// 	var schemaPaths = this._path.addTo({}, {
// 		x: Number,
// 		y: Number,
// 		width: Number,
// 		height: Number,
// 	});

// 	schema.add(schemaPaths);

// 	var reset = function (item) {
// 		item.set(field.path, getEmptyValue());
// 	};

// 	var schemaMethods = {
// 		reset: function () {
// 			reset(this);
// 		},
// 	};

// 	_.forEach(schemaMethods, function (fn, key) {
// 		field.underscoreMethod(key, fn);
// 	});

// 	// expose a method on the field to call schema methods
// 	this.apply = function (item, method) {
// 		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
// 	};

// 	this.bindUnderscoreMethods();
// };

// /**
//  * Formats the field value
//  */
// imagearea.prototype.format = function (item) {
// 	return item.get(this.paths.url);
// };

// /**
//  * Gets the field's data from an Item, as used by the React components
//  */
// imagearea.prototype.getData = function (item) {
// 	var value = item.get(this.path);
// 	return typeof value === 'object' ? value : {};
// };

// imagearea.prototype._originalGetOptions = imagearea.prototype.getOptions;

// imagearea.prototype.getOptions = function () {
// 	this._originalGetOptions();
// 	return this.__options;
// };

// /**
//  * Detects whether the field has been modified
//  */
// imagearea.prototype.isModified = function (item) {
// 	return item.isModified(this.paths.x)
// 	|| item.isModified(this.paths.y)
// 	|| item.isModified(this.paths.width)
// 	|| item.isModified(this.paths.height);
// };


// function validateInput (value) {
// 	// undefined values are always valid
// 	if (value === undefined || value === null || value === '') return true;
// 	if (typeof value === 'object' && value.x && value.y && value.width && value.height) return true;
// 	// None of the above? we can't recognise it.
// 	return false;
// }

// /**
//  * Validates that a value for this field has been provided in a data object
//  */
// imagearea.prototype.validateInput = function (data, callback) {
// 	var value = data ? JSON.parse(data) : '';
// //	 this.getValueFromData(data);
// 	var result = validateInput(value);
// 	utils.defer(callback, result);
// };

// /**
//  * Validates that input has been provided
//  */
// imagearea.prototype.validateRequiredInput = function (item, data, callback) {
// 	// TODO: We need to also get the `files` argument, so we can check for
// 	// uploaded files. without it, this will return false negatives so we
// 	// can't actually validate required input at the moment.
// 	var result = true;
// 	// var value = this.getValueFromData(data);
// 	// var result = (value || item.get(this.path).public_id) ? true : false;
// 	utils.defer(callback, result);
// };

// /**
//  * Always assumes the input is valid
//  *
//  * Deprecated
//  */
// imagearea.prototype.inputIsValid = function () {
// 	return true;
// };

// /**
//  * Updates the value for this field in the item from a data object
//  * TODO: It is not possible to remove an existing value and upload a new image
//  * in the same action, this should be supported
//  */
// imagearea.prototype.updateItem = function (item, data, files, callback) {
// 	// Prepare values
// 	var value = this.getValueFromData(data);

// 	// Empty / null values reset the field
// 	if (value === null || value === '' || (typeof value === 'object' && !Object.keys(value).length)) {
// 		value = getEmptyValue();
// 	}

// 	// If there is a valid value at this point, set it on the field
// 	if (typeof value === 'object') {
// 		item.set(this.path, value);
// 	}
// 	utils.defer(callback);
// };

// /* Export Field Type */
// module.exports = imagearea;


var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
function imagearea (list, path, options) {
	this.options = options;
	this._nativeType = String;
	this._properties = ['monospace'];
	this._underscoreMethods = ['crop'];
	imagearea.super_.call(this, list, path, options);
}
imagearea.properName = 'ImageArea';
util.inherits(imagearea, FieldType);

imagearea.prototype.validateInput = function (data, callback) {
	var max = this.options.max;
	var min = this.options.min;
	var value = this.getValueFromData(data);
	var result = value === undefined || value === null || typeof value === 'string';
	if (max && typeof value === 'string') {
		result = value.length < max;
	}
	if (min && typeof value === 'string') {
		result = value.length > min;
	}
	utils.defer(callback, result);
};

imagearea.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = !!value;
	if (value === undefined && item.get(this.path)) {
		result = true;
	}
	utils.defer(callback, result);
};

/**
 * Add filters to a query
 */
imagearea.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		return query;
	}
	var value = utils.escapeRegExp(filter.value);
	if (filter.mode === 'beginsWith') {
		value = '^' + value;
	} else if (filter.mode === 'endsWith') {
		value = value + '$';
	} else if (filter.mode === 'exactly') {
		value = '^' + value + '$';
	}
	value = new RegExp(value, filter.caseSensitive ? '' : 'i');
	query[this.path] = filter.inverted ? { $not: value } : value;
	return query;
};

/**
 * Crops the string to the specifed length.
 */
imagearea.prototype.crop = function (item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/* Export Field Type */
module.exports = imagearea;
