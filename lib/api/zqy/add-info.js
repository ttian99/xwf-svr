var Base = require('../../model/user-model.js');
var Info = require('../../model/info-model.js');
var cfg = require('../../../cfg.js');
var log = cfg.log('add-info');

module.exports = function addInfo(body, resCb) {
	log.debug('add-info', body);
	// var userId = 'zqy-001';
	// var userNick = '好人雷锋';
	// var modifyTime = new Date();


	var infoTest = {
		time: body.time, // 收件时间
		mfr: body.mfr, // 厂家 manufacturer
		epsCnee: body.epsCnee, // 快递收货人 express consignee 
		trueCnee: body.trueCnee, // 真实收件人 true consignee
		goodsName: body.goodsName, // 物件的名称
		goodsNum: body.goodsNum, // 物件的数量 
		goodsMod: body.goodsMod, // 物件的型号 goods model
		desc: body.desc, // 备注 
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