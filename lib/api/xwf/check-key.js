var cfg = require('../../../cfg.js');
var log = cfg.log('check-key');
var _ = require('lodash');
var svArr = require('../../config/xwf-s2v-data.js');
var psql = require('../../db/psql.js');
var v2sObj = require('../../config/xwf-v2s-data.js');
var async = require('async');
var path = require('path');
var fs = require('fs');

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
					log.debug('------- map keyArr over----');
					log.debug(JSON.stringify(matchArr));
					callback(null, matchArr);
				}
			});
		},
		function (matchArr, callback) {
			var keyArr = [];
			var len = matchArr.length;

			// 如果keyArr为空，直接返回
			if (len === 0) {
				callback(null, keyArr);
			}

			_.map(matchArr, function(item, id) {
				var filename = v2sObj[item].idx + '';
				var file = path.join(__dirname, '/../../config/v2s/', filename + '.json');
				log.debug('file = ' + file);
				var arr = [];
				if (fs.existsSync(file)) {
					log.debug('------------ hahah  ------------');
					var buf = fs.readFileSync(file);
					var obj = JSON.parse(buf);
					arr = _.keys(obj);
					var newArr = [];
					_.map(arr, function(some, idx) {
						newArr.push({ 
							'keyWords': some,
							"idx": filename 
						});

						if (idx === arr.length - 1) {
							console.log('---------- arr = ' + arr);
							keyArr = keyArr.concat(newArr);
							console.log('keyArr = ' + keyArr);
						}
					});
				} else {
					// 没有文件就为空值
					keyArr = keyArr.concat(arr);
				}
				
				if (id === len - 1) {
					log.debug('------- map matchArr over----');
					callback(null, keyArr);
				}
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
			var rst = body;
			rst.matchArr = matchArr;
			_.merge(rst, cfg.rst.SUCC);
			log.debug('rst', JSON.stringify(rst));
			resCb(rst);
		}
	});
};
