var cfg = require('../../../cfg.js');
var log = cfg.log('search-village');
var _ = require('lodash');
var svArr = require('../../config/xwf-s2v-data.js');
var psql = require('../../db/psql.js');
var async = require('async');
module.exports = function searchVillage(body, resCb) {
	log.debug('-- body - ', body);
	var words = body.words;
	if (!words) {
		log.warn('search-village words is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	// async的瀑布流操作
	async.waterfall([
		function (callback) {
			checkWords(words, function (matchArr) {
				callback(null, matchArr);
			});
		},
		function (arg1, callback) {
			concatArr(arg1, function(matchArr) {
				callback(null, matchArr);	
			});
		}
	], function (err, result) {
		if (err) {
			log.error('err', err);
			resCB(cfg.rst.EDB);
		} else {
			// 匹配关键字
			var matchArr = result;
			// log.debug('-- matchArr', matchArr);
			// 返回数据
			var rst = body;
			rst.matchArr = matchArr;
			_.merge(rst, cfg.rst.SUCC);
			log.debug('rst', JSON.stringify(rst));
			resCb(rst); 
		}
	});
};

// 匹配关键字
function checkWords(word, cb) {
	var matchArr = [];
	var tempArr = [];
	svArr.forEach(function(item, i) {
		// 获取学校
		var key = _.keys(item)[0];
		// 检测是否匹配关键字
		var list = _.filter(item[key], function(some) {
			var reg = new RegExp(word, "gi");
			var ok = some.match(reg);
			return ok;
		});

		// if (list.length > 0)
		// 	log.debug('list', list);
		var newList = _.map(list, function(some) {
			var obj = { 
				key: some,
				list: [{name: key}] 
			};
			return obj
		});
		// 将构造的素组合并至匹配数组
		if (newList.length) {
			matchArr = matchArr.concat(newList);
		}
	});

	/*
	* --是否需要递归关键字匹配--
	* 1.匹配数组长度为0
	* 2.关键字的长度必须大于等于3
	*/
	if (matchArr.length == 0 && word.length > 2) {
		var newWord = word.slice(0, -1);
		return checkWords(newWord, cb);
	} else {
		// concatArr(matchArr);
		cb(matchArr);
	}
}




// 
function concatArr(matchArr, cb) {
	var hash = {}; // 用于标记重复元素的hash
	var comm = []; // 用于存放重复元素的数组
	// 记录重复的元素
	_.map(matchArr, function (some, i) {
		if (hash[some.key]) {
			hash[some.key] = hash[some.key].concat(i);
		} else {
			hash[some.key] = [i];
		}
	});
	// log.debug('hash = ', hash);

	// 遍历hash找出重复的元素,合并key值重复的元素 
	_.mapKeys(hash, function (value, key) {
		if (value.length > 1) {
			var tmp = { key: '', list: [] };
			_.map(value, function (item, i) {
				// 用空值替换重复的数组元素，并返回包含删除元素的新数组
				var delArr = matchArr.splice(item, 1, "");
				var delObj = delArr[0];
				// 查找重复数组中的元素是含有相同key值的，并且返回数组对应的index
				var pos = _.findIndex(comm, function (o) {
					return o.key == delObj.key;
				});
				// 合并重复元素的list
				if (pos < 0) {
					tmp.key = delObj.key
					tmp.list = tmp.list.concat(delObj.list);
					comm = comm.concat(tmp);
				} else {
					comm[pos].list = comm[pos].list.concat(delObj.list);
				}
			});
		}
	});

	// 去除数组内的空值 
	matchArr = _.compact(matchArr);
	// 合并重复数组和原来的无重复数组
	matchArr = comm.concat(matchArr);
	cb(matchArr);
}
