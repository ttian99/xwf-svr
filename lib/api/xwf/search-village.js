var cfg = require('../../../cfg.js');
var log = cfg.log('search-village');
var _ = require('lodash');
var svArr = require('../../config/xwf-sv-data.js');
var psql = require('../../db/psql.js');

module.exports = function searchVillage(body, resCb) {
	log.debug('-- body - ', body);
	var words = body.words;
	if (!words) {
		log.warn('search-village words is null');
		resCb(cfg.rst.EPARAM);
		return;
	}

	// 匹配字体 
	var matchArr = checkWords(words);
	log.debug('matchArr', matchArr);
	// 返回数据
	var rst = {}
	rst.matchArr = matchArr;
	_.merge(rst, cfg.rst.SUCC);
	log.debug('rst', JSON.stringify(rst));
	resCb(rst);
};

function checkWords(word) {
	var matchArr = [];
	svArr.forEach(function(item, i) {
		// 获取学校
		var key = _.keys(item)[0];
		// 检测是否匹配关键字
		var list = _.filter(item[key], function(some) {
			var reg = new RegExp(word, "gi");
			var ok = some.match(reg);
			return ok;
		});

		var newList = _.map(list, function(some) {
			var obj = { 
				key: some,
				list: [{name: key}] 
			};
			return obj
		});
		if (newList.length) {
			log.debug('newList', newList);
			matchArr = matchArr.concat(newList);
		}
		// var matchValue = item[key][]

		// if (ok) {
		// 	obj = { name: some };
		// 	log.debug('obj = ', obj);
		// }
		// if(list.length){
		// 	log.debug('list', list);	
		// }
		
		// var pos = _.findIndex(item[key], function(some) {
		// 	var reg = new RegExp(word, "gi");
		// 	var ok = some.match(reg);
		// 	return ok
		// });
		
		// if (pos >= 0) {
		// 	var matchValue = item[key][pos];
		// 	matchArr.push({matchValue: matchValue, schoolName: key});

		// 	// var list = [];
		// 	// values.forEach(function (item, i) {
		// 	// 	list.push({ name: item });
		// 	// });

		// 	// var schoolObj = {
		// 	// 	key: key,
		// 	// 	list: list
		// 	// }
		// 	// matchArr.push(schoolObj);
		// }
	});

	/*
	* --是否需要递归关键字匹配--
	* 1.匹配数组长度为0
	* 2.关键字的长度必须大于等于3
	*/
	if (matchArr.length == 0 && word.length > 3) {
		var newWord = word.slice(0, -1);
		return checkWords(newWord);
	} else {
		return matchArr;
	}
}
