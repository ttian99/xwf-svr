var Base = require('../model/user-model.js');
var Info = require('../model/info-model.js');
var cfg = require('../../cfg.js');
var log = cfg.log('add-info');

module.exports = function addInfo(body, resCb) {
	log.debug('add-info', body);
	var userId = 'zqy-001';
	var userNick = '内马尔';
	var modifyTime = new Date();

	var infoTest = {
		modifyTime: modifyTime, //修改时间
	  	userId: userId, // 上报信息的用户id
	  	userNick: userNick, //上报信息的用户昵称
	  	goodsName: '涡轮增加机', // 物件的名称
	  	goodsNum: 2, // 物件的数量
	  	goodsType: '1', // 物件的类型
	  	desc: ''
	};

	var doc = new Info(infoTest);

	doc.orderId = doc._id;
	doc.save(function (err){
		if (err) {
			log.error(err);
			resCb(cfg.rst.EDB);
		} else {
			resCb(cfg.rst.SUCC);
		}
	});
};