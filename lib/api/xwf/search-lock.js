var cfg = require('../../../cfg.js');
var log = cfg.log('search-lock');
var _ = require('lodash');
var svArr = require('../../config/xwf-s2v-data.js');
var psql = require('../../db/psql.js');
var async = require('async');
var decode = require('../../tool/decode.js');
var v2sObj = require('../../config/xwf-v2s-data.js');

module.exports = function searchLock(body, resCb) {
	log.debug('-- body - ', body);
	var code = body.code;
	if (!code) {
		log.warn('search-lock code is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	async.waterfall([
		function(callback) {
			log.debug('---------------- psql search -------------');
			// var sqlStr = "SELECT houseaddress,islocked,lockxxs,lockyear FROM room WHERE houseaddress='" + words + "';"
			var sqlStr = "SELECT * FROM room WHERE code='" + code + "';"
			psql.search1(sqlStr, function (err, res) {
				if (err) {
					log.error('sql error :', err);
					callback(err);
				}
				log.debug('-------- sql ---------');
				log.debug(res);
				if (res.rows.length < 1) {
					var msg = 'sql not find the code = ' + code;
					log.warn(msg);
					callback(msg);
				}
				var obj = res.rows[0]
				callback(null, obj);
			});
		},
		function (obj, callback) {
			var idx = body.idx + '';
			var key = _.findKey(v2sObj, { 'idx': idx });
			// var key = _.findKey(v2sObj, 'idx', idx);
			log.debug('key = ', key);
			var schoolList;
			if (key) {
				schoolList = v2sObj[key].schoolList;
			} else {
				schoolList = [];
			}
			callback(null, obj, schoolList);
		},
		function(obj, schoolList, callback) {
			// 获取返回的数组	
			var getArr = function (arr) {
				var newArr = _.map(arr, function (item, id) {
					var oo = {}
					oo.name = item;
					oo.year = '未锁定';
					return oo;
				});
				return newArr;
			}

			var matchArr;
			if (obj.islocked === 'Y') {
				matchArr = getArr(schoolList);
				var name = _.trim(obj.lockxxs);
				log.debug('name = ', name);
				name = decode.trueHtmlToUTF8(name);

				var lockArr = name.split(',');
				var lockMatchArr = [];
				_.map(lockArr, function (item, id) {
					lockMatchArr.push({ name: item, year: obj.lockyear });
				});

				log.debug('lockMatchArr', JSON.stringify(lockMatchArr));
				lockMatchArr = lockMatchArr.concat(matchArr);
				// matchArr = matchArr.concat(lockMatchArr);
				matchArr = _.unionWith(lockMatchArr, [], function (a, b) {
					if (a.name === b.name) {
						var ret = (a.year === '未锁定') ? b : a;
						return ret;
					} else {
						return false;
					}
				});
				log.debug('matchArr = ', matchArr);
			} else {
				matchArr = getArr(schoolList);
			}
			callback(null, matchArr);
		}
	], function(err, result){
		log.debug('search-lock', err);
		log.debug('search-lock', result);
		if (err) {
			log.error('err', err);
			resCB(cfg.rst.EDB);
		} else {
			// 匹配关键字
			var matchArr = result;
			log.debug('-- matchArr', matchArr);
			// 返回数据
			var rst = body;
			rst.matchArr = matchArr;
			_.merge(rst, cfg.rst.SUCC);
			log.debug('rst', JSON.stringify(rst));
			resCb(rst);
		}
	});
	
	// //
	// function getSchoolList(idx) {
	// 	idx = idx + '';
	// 	var key = _.findKey(v2sObj, { 'idx': idx });
	// 	log.debug('key = ', key);
	// 	return v2sObj[key].schoolList; 
	// }


	// async的瀑布流操作
	// async.waterfall([
	// 	function(callback) {
	// 		log.debug('---------------- checkWords -------------');
	// 		checkWords(words, function (matchArr) {
	// 			callback(null, matchArr);
	// 		});
	// 	}, 
	// 	function(arg1, callback) {
	// 		log.debug('---------------- concatArr -------------');
	// 		log.debug('arg1', JSON.stringify(arg1));
	// 		var matchArr = _.uniq(arg1);
	// 		callback(null, matchArr);
	// 	},
	// 	function (arg2, callback) {
	// 		log.debug('---------------- psql search -------------');
	// 		log.debug('arg2', JSON.stringify(arg2));
	// 		var sqlStr = "SELECT houseaddress,islocked,lockxxs,lockyear FROM room WHERE houseaddress LIKE '%" + words + "%';"
	// 		psql.search1(sqlStr, function(err, res) {
	// 			if (err) {
	// 				log.error('sql error :', err);
	// 				callback(err);
	// 			}

	// 			log.debug('-------- sql ---------');
	// 			log.debug(res);
	// 			// 获取返回的数组	
	// 			var getArr = function (arr) {
	// 				var newArr = _.map(arr, function (item, id) {
	// 					var oo = {}
	// 					oo.name = item;
	// 					oo.year = '未锁定';
	// 					return oo;
	// 				});
	// 				return newArr;
	// 			}
				
	// 			var matchArr;
	// 			var arr = res.rows
	// 			var obj = arr[0];
	// 			if (obj.islocked === 'Y') {
	// 				matchArr = getArr(arg2);
	// 				var name = _.trim(obj.lockxxs);
	// 				log.debug('name = ' , name );
	// 				name = decode.trueHtmlToUTF8(name);
					
	// 				var lockArr = name.split(',');
	// 				var lockMatchArr = [];
	// 				_.map(lockArr, function(item, id){
	// 					lockMatchArr.push({ name: item, year: obj.lockyear });
	// 				});

	// 				log.debug('lockMatchArr', JSON.stringify(lockMatchArr));
	// 				lockMatchArr = lockMatchArr.concat(matchArr);
	// 				// matchArr = matchArr.concat(lockMatchArr);
	// 				matchArr = _.unionWith(lockMatchArr, [], function (a, b) {
	// 					if (a.name === b.name) {
	// 						var ret = (a.year === '未锁定') ? b : a;
	// 						return ret;
	// 					} else {
	// 						return false;
	// 					}
	// 				});
	// 				log.debug('matchArr = ', matchArr);
	// 			} else {
	// 				matchArr = getArr(arg2);
	// 			}
	// 			callback(null, matchArr);
	// 		});
	// 	}
	// ], function (err, result) {
	// 	log.debug('search-lock', err);
	// 	log.debug('search-lock', result);
	// 	if (err) {
	// 		log.error('err', err);
	// 		resCB(cfg.rst.EDB);
	// 	} else {
	// 		// 匹配关键字
	// 		var matchArr = result;
	// 		log.debug('-- matchArr', matchArr);
	// 		// 返回数据
	// 		var rst = {}
	// 		rst.matchArr = matchArr;
	// 		_.merge(rst, cfg.rst.SUCC);
	// 		log.debug('rst', JSON.stringify(rst));
	// 		resCb(rst); 
	// 	}
	// });
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

		if (list.length > 0)
			log.debug('list', list);

		var newList = _.map(list, function() {
			return key;
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
		log.debug('test', matchArr);
		cb(matchArr);
	}
}



// // 匹配关键字
// function checkWords(word, cb) {
// 	var matchArr = [];
// 	var tempArr = [];
// 	svArr.forEach(function(item, i) {
// 		// 获取学校
// 		var key = _.keys(item)[0];
// 		// 检测是否匹配关键字
// 		var list = _.filter(item[key], function(some) {
// 			var reg = new RegExp(word, "gi");
// 			var ok = some.match(reg);
// 			return ok;
// 		});

// 		// if (list.length > 0)
// 		// 	log.debug('list', list);
// 		var newList = _.map(list, function(some) {
// 			var obj = { 
// 				key: some,
// 				list: [{name: key}] 
// 			};
// 			return obj
// 		});
// 		// 将构造的素组合并至匹配数组
// 		if (newList.length) {
// 			matchArr = matchArr.concat(newList);
// 		}
// 	});

// 	/*
// 	* --是否需要递归关键字匹配--
// 	* 1.匹配数组长度为0
// 	* 2.关键字的长度必须大于等于3
// 	*/
// 	if (matchArr.length == 0 && word.length > 2) {
// 		var newWord = word.slice(0, -1);
// 		return checkWords(newWord, cb);
// 	} else {
// 		// concatArr(matchArr);
// 		cb(matchArr);
// 	}
// }




// 
// function concatArr(matchArr, cb) {
// 	var hash = {}; // 用于标记重复元素的hash
// 	var comm = []; // 用于存放重复元素的数组
// 	// 记录重复的元素
// 	_.map(matchArr, function (some, i) {
// 		if (hash[some.key]) {
// 			hash[some.key] = hash[some.key].concat(i);
// 		} else {
// 			hash[some.key] = [i];
// 		}
// 	});
// 	log.debug('hash = ', hash);

// 	// 遍历hash找出重复的元素,合并key值重复的元素 
// 	_.mapKeys(hash, function (value, key) {
// 		if (value.length > 1) {
// 			var tmp = { key: '', list: [] };
// 			_.map(value, function (item, i) {
// 				// 用空值替换重复的数组元素，并返回包含删除元素的新数组
// 				var delArr = matchArr.splice(item, 1, "");
// 				var delObj = delArr[0];
// 				// 查找重复数组中的元素是含有相同key值的，并且返回数组对应的index
// 				var pos = _.findIndex(comm, function (o) {
// 					return o.key == delObj.key;
// 				});
// 				// 合并重复元素的list
// 				if (pos < 0) {
// 					tmp.key = delObj.key
// 					tmp.list = tmp.list.concat(delObj.list);
// 					comm = comm.concat(tmp);
// 				} else {
// 					comm[pos].list = comm[pos].list.concat(delObj.list);
// 				}
// 			});
// 		}
// 	});

// 	// 去除数组内的空值 
// 	matchArr = _.compact(matchArr);
// 	// 合并重复数组和原来的无重复数组
// 	matchArr = comm.concat(matchArr);
// 	cb(matchArr);
// }
