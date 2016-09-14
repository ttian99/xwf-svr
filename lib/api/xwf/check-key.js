var cfg = require('../../../cfg.js');
var log = cfg.log('check-key');
var _ = require('lodash');
var svArr = require('../../config/xwf-sv-data.js');
var psql = require('../../db/psql.js');
var v2sObj = require('../../config/xwf-v2s-data.js');
var async = require('async');
module.exports = function checkKey(body, resCb) {
	log.debug('-- body - ', body);
	var words = body.words;
	if (!words) {
		log.warn('check-key words is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	// async的瀑布流操作
	async.waterfall([
		function (callback) {
			var matchArr = [];
			var keyArr = _.keys(v2sObj);
			log.debug('keyArr = ', JSON.stringify(keyArr));
			var len = keyArr.length;
			_.map(keyArr, function (item, id) {
				// console.log('---------');
				var reg = new RegExp(words, 'gi');
				var isMatch = reg.test(item);
				if (isMatch) {
					matchArr.push(item);
				}

				if (id === len - 1) {
					callback(null, matchArr);
				}
			});
		},
		function (matchArr, callback) {
			_.map(matchArr, function(item, id) {
				var filename = v2sObj[item].idx + '';
				var file = path.join(__dirname, '/../../config/v2s/', filename + '.json');
			});
		}
	], function (err, result) {
		if (err) {
			log.error('err', err);
			resCb(cfg.rst.EDB);
		} else {
			// // 匹配关键字
			var matchArr = result;
			log.debug('-- matchArr', matchArr);
			// // 返回数据
			var rst = {}
			rst.matchArr = matchArr;
			_.merge(rst, cfg.rst.SUCC);
			log.debug('rst', JSON.stringify(rst));
			resCb(rst);
		}
	});
};
