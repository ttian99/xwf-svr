var cfg = require('../../../cfg.js');
var log = cfg.log('select-ridgepole');
var _ = require('lodash');
var svArr = require('../../config/xwf-s2v-data.js');
var psql = require('../../db/psql.js');
var async = require('async');
var fs = require('fs');
var path = require('path');
var v2sObj = require('../../config/xwf-v2s-data.js');

module.exports = function selectRidgepole(body, resCb) {
	log.debug('body', body);
	var words = body.keyWords;
	if (!words) {
		log.warn('select-ridgepole words is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	var matchArr = [];
	async.waterfall([
		function(callback) {
			var filename = body.idx;
			var file = path.join(__dirname, '/../../config/v2s/', filename + '.json');
			log.debug('file = ' + file);
			var isExists = fs.existsSync(file);
			log.debug('isExists = ' + isExists);
			fs.readFile(file, 'utf8', function(err, data) {
				if (err) {
					log.error('readFile ' + file + 'error');
					// resCb(cfg.rst.EDB);
					callback(err);
				} else {
					var json = JSON.parse(data);
					matchArr = json[body.keyWords][body.building]
					log.debug('matchArr', JSON.stringify(matchArr));
					callback(null, matchArr);
				}
			})
		},
	], function(err, result) {
		if (err) {
			resCb(cfg.rst.EDB);
		} else {
			// // 返回数据
			var rst = body;
			rst.matchArr = matchArr;
			_.merge(rst, cfg.rst.SUCC);
			log.debug('rst', JSON.stringify(rst));
			resCb(rst);
		}

	})



	// // async的瀑布流操作
	// async.waterfall([
	// 	function (callback) {
	// 		var sqlStr = "SELECT houseaddress FROM room WHERE houseaddress LIKE '%" + words + "%';"
	// 		psql.search1(sqlStr, function(err, res) {
	// 			if (err) {
	// 				log.error('sql error :', err);
	// 				callback(err);
	// 			}

	// 			log.debug('-------- sql ---------');
	// 			// log.debug(res);
	// 			callback(null, res);
	// 		});
	// 	},
	// 	function (arg1, callback) {
	// 		log.debug('debug--------------');
	// 		var tmp = [];
	// 		var arr = arg1.rows;
	// 		log.debug('arr =', arr);
	// 		if(arr.length === 0 ){
	// 			callback(null, tmp);
	// 		}
	// 		_.map(arr, function(item, id) {
	// 			var str = item['houseaddress'];
	// 			str = _.trim(str);// 去掉多余的空格
	// 			var goodStr = str.replace(words, '');
	// 			tmp.push(goodStr);

	// 			if (id === arr.length - 1) {
	// 				log.debug('tmp = ', tmp);
	// 				callback(null, tmp);
	// 			}
	// 		});

	// 	}
	// ], function (err, result) {
	// 	if (err) {
	// 		log.error('err', err);
	// 		resCb(cfg.rst.EDB);
	// 	} else {
	// 		// // 匹配关键字
	// 		var matchArr = result;
	// 		log.debug('-- matchArr', matchArr);
	// 		// // 返回数据
	// 		var rst = {}
	// 		rst.matchArr = matchArr;
	// 		_.merge(rst, cfg.rst.SUCC);
	// 		log.debug('rst', JSON.stringify(rst));
	// 		resCb(rst); 
	// 	}
	// });
};