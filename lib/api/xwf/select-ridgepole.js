var cfg = require('../../../cfg.js');
var log = cfg.log('select-ridgepole');
var _ = require('lodash');
var svArr = require('../../config/xwf-sv-data.js');
var psql = require('../../db/psql.js');
var async = require('async');

module.exports = function selectRidgepole(body, resCb) {
	log.debug('body', body);
	var words = body.words;
	if (!words) {
		log.warn('select-ridgepole words is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	// async的瀑布流操作
	async.waterfall([
		function (callback) {
			var sqlStr = "SELECT houseaddress FROM room WHERE houseaddress LIKE '%" + words + "%';"
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
				var goodStr = str.replace(words, '');
				tmp.push(goodStr);

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
