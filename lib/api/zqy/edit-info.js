var Base = require('../../model/user-model.js');
var Info = require('../../model/info-model.js');
var cfg = require('../../../cfg.js');
var log = cfg.log('edit-info');

module.exports = function editInfo(body, resCb) {
	log.debug('edit-info', body);
	var projection = 'modifyTime userId userNick goodsName goodsNum goodsType desc';
	Info.findOne({ orderId: body.orderId }, projection, function(err, doc) {
		if (!doc) {
			log.warn('doc is not find');
			resCb(cfg.rst.EDB);
		} else {
			log.debug('edit-info success');
			log.debug(doc);

			doc.modifyTime = body.modifyTime || new Date();
			doc.userId = body.userId || doc.userId;
			doc.userNick = body.userNick || doc.userNick;
			doc.goodsName = body.goodsName || doc.goodsName;
			doc.goodsNum = body.goodsNum || doc.goodsNum;
			doc.goodsType = body.goodsType || doc.goodsType;
			doc.desc = body.desc || doc.desc;

			doc.save();
			resCb(cfg.rst.SUCC);
		}
	});
};