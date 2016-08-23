var Base = require('../../model/user-model.js');
var Info = require('../../model/info-model.js');
var cfg = require('../../../cfg.js');
var log = cfg.log('del-info');

module.exports = function delInfo(body, resCb) {
	log.debug('del-info', body);
	
	Info.findOne({ orderId: body.orderId }, function(err, doc) {
		if (!doc) {
			log.warn('doc is not find');
			resCb(cfg.rst.EDB);
		} else {
			log.debug('del-info success');
			doc.remove();
			resCb(cfg.rst.SUCC);
		}
	});
};