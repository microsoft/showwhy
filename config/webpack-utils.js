/**
 * The base URL used in html must end with a trailing slash. This function enforces that.
 * If a number is passed in, we create an url at "http://localhost:<num>/"
 * @param {string | number} url
 * @returns
 */
exports.baseUrl = function baseUrl(url) {
	if (typeof url === 'number') {
		url = `http://localhost:${url}/`
	}
	return url.endsWith('/') ? url : `${url}/`
}
