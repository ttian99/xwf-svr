var cfg = require('../../../cfg.js');
var log = cfg.log('search-school');
var _ = require('lodash');
var svArr = require('../../config/xwf-s2v-data.js');
var psql = require('../../db/psql.js');

module.exports = function searchSchool(body, resCb) {
	log.debug('body', body);
	var words = body.words;
	if (!words) {
		log.warn('search-school words is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	var matchArr = [];
	svArr.forEach(function (some, id) {
		var keyArr = _.keys(some);
		var key = keyArr[0];
		var values = some[key];
		var reg = new RegExp(words, "gi");
		var ok = key.match(reg);		
		if (ok) {
			log.debug('-- key = ' + key);

			var list = _.map(values, function(item) {
				var obj = { name: item }
				return obj;
			});

			var schoolObj = {
				key: key,
				list: list
			}
			matchArr.push(schoolObj);
		}
	});

	var rst = body;
	rst.matchArr = matchArr;
	_.merge(rst, cfg.rst.SUCC);
	log.debug('rst', JSON.stringify(rst));
	resCb(rst);
};