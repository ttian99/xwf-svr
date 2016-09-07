/**
 * 还原成UTF8格式
 * @param  {String} str lick: \u6587\u4ef6\u8bfb\u53d6\u5b8c\u6210\x3d
 * @return {String}     utf8
 */
exports.unicodeToUTF8 = function(str) {
	str = str.replace(/(\\u)(\w{4})/gi, function($0, $1, $2) {
		return String.fromCharCode(parseInt($2, 16));
	});

	// \x3d <=> '='
	str = str.replace(/(\\x)(\w{2})/gi, function($0, $1, $2) {
		return String.fromCharCode(parseInt($2, 16));
	});
	return str;
}

/**
 * 还原成UTF8格式
 * @param  {String} str lick: &#29579;&#23612;&#29595;
 * @return {String}     utf8
 */
exports.trueHtmlToUTF8 = function(str) {
	str = str.replace(/(&#)(\d+;)/g, function($0, $1, $2) {
		return String.fromCharCode(parseInt($2));
	});
	return str
}