var cfg = require('../../../cfg.js');
var log = cfg.log('check-key');
var _ = require('lodash');
var svArr = require('../../config/xwf-sv-data.js');
var psql = require('../../db/psql.js');
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
			// checkWords(words, function (matchArr) {
			// 	callback(null, matchArr);
			// });
			var sqlStr = "SELECT houseaddress FROM room WHERE houseaddress LIKE '%" + words + "%' limit 100;"
			// var sqlStr = "SELECT houseaddress FROM room WHERE ho LIKE '%" + words + "%' limit 100;"
			psql.search1(sqlStr, function(err, res) {
				if (err) {
					log.error('sql error :', err);
					callback(err);
				}

				log.debug('-------- sql ---------');
				// log.debug(res);
				callback(null, res);
			});
		},
		function (arg1, callback) {
			log.debug('debug--------------');
			var tmp = [];
			var arr = arg1.rows;
			log.debug('arr =', arr);
			if(arr.length === 0 ){
				callback(null, tmp);
			}
			_.map(arr, function(item, id) {
				var str = item['houseaddress'];
				str = _.trim(str);// 去掉多余的空格
				// log.debug('str.length = ' , str.length);
				var strArr = str.split('');
				log.debug("strArr = ", JSON.stringify(strArr));
				var startPos = _.findIndex(strArr, function(item) {
					var aa = /^[0-9]*$/.exec(item);
					return aa;
				});

				var endPos = _.findLastIndex(strArr, function(item) {
					var bb = /^\D$/.exec(item);
					return bb;
				});

				var mPos = strArr.length - endPos - 1;
				log.debug('startPos = ' + startPos + ' , endPos = ' + endPos + ' , mPos = ' +  mPos);

				var match = _.drop(strArr, startPos);
				match = _.dropRight(match, mPos);
				var goodStr = match.join("");
				// tmp.push({name: goodStr});
				tmp.push(goodStr);

				log.debug('goodStr = ', goodStr);

				if (id === arr.length - 1) {
					log.debug('tmp = ', tmp);
					callback(null, tmp);
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
			matchArr = _.uniq(matchArr, 'name');
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