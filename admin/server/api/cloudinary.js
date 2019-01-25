const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

/*
TODO: Needs Review and Spec
*/

module.exports = {
	upload: function (req, res) {
		if (req.files && req.files.file) {
			var formData = new FormData();

			console.log(req.files.file);
			formData.append('file', fs.createReadStream(req.files.file.path), {
				filename: req.files.file.originalname,
			});

			fetch(`http://eclainary.peppyhost.site/images/${process.env.ECLAINARY_TOKEN}`,
			{ method: 'POST', body: formData })
				.then(function (res) {
					return res.json();
				})
				.then(function (res) {
					var sendResult = function () {
						res.send({
							image: res.url,
						});
					};

					res.format({
						html: sendResult,
						json: sendResult,
					});
				})
				.catch(function (err) {
					res.send({ error: { message: err } });
				});
		} else {
			res.json({ error: { message: 'No image selected' } });
		}
	},
	autocomplete: function (req, res) {
		var cloudinary = require('cloudinary');
		var max = req.query.max || 10;
		var prefix = req.query.prefix || '';
		var next = req.query.next || null;

		cloudinary.api.resources(function (result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({
					next: result.next_cursor,
					items: result.resources,
				});
			}
		}, {
			type: 'upload',
			prefix: prefix,
			max_results: max,
			next_cursor: next,
		});
	},
	get: function (req, res) {
		var cloudinary = require('cloudinary');
		cloudinary.api.resource(req.query.id, function (result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({ item: result });
			}
		});
	},
};
