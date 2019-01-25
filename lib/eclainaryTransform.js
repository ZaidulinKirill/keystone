module.exports = (url, options, format) => {
	if (!url) return '';

	if (!options || !options.length) return url;

	return url.replace('images/', 'images/' + options + '/') + (format ? '.' + format : '');
};
