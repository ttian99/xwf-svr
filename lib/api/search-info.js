var Base = require('../model/user-model.js');
var Info = require('../model/Info-model.js');
var cfg = require('../../cfg.js');
var log = cfg.log('search-info');

module.exports = function searchInfo(body, resCb) {
	log.debug('search-info', body);
	
	// Info.find({ orderId: body.orderId }, function(err, doc) {
	// 	if (!doc) {
	// 		log.warn('doc is not find');
	// 		resCb(cfg.rst.EDB);
	// 	} else {
	// 		log.debug('search-info success');
	// 		doc.remove();
	// 		resCb(cfg.rst.SUCC);
	// 	}
	// });

	var qs=new RegExp('哈哈');
	// Info.where('userNick', qs)
	// 	.or('goodsName', qs)
	// 	.or('desc', qs)
	// 	.exec(function (err, docs) {
	// 		console.log(typeof(docs))
	// 		console.log(docs.length);
	// 	})
	Info.find({ userId: qs }, function(err, docs) {
		if (!docs) {
			log.warn('doc is not find');
			resCb(cfg.rst.EDB);
		} else {
			log.debug('search-info success');
			// doc.remove();
			log.debug(docs.length);
			resCb(cfg.rst.SUCC);
		}
	});
};