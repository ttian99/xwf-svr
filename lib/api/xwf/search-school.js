// var Base = require('../model/user-model.js');
// var Info = require('../model/info-model.js');
var cfg = require('../../../cfg.js');
var log = cfg.log('search-school');
var _ = require('lodash');


module.exports = function searchSchool(body, resCb) {
	log.debug('search-school', body);
	var words = body.words || '哈哈';
	var qs = new RegExp(words);




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

	// Info.where('userNick', qs)
	// 	.or('goodsName', qs)
	// 	.or('desc', qs)
	// 	.exec(function (err, docs) {
	// 		console.log(typeof(docs))
	// 		console.log(docs.length);
	// 	})
	// Info.find({ goodsName: qs }, function(err, docs) {
	// 	if (!docs) {
	// 		log.warn('doc is not find');
	// 		resCb(cfg.rst.EDB);
	// 	} else {
	// 		log.debug('search-info success');
	// 		// doc.remove();
	// 		log.debug(docs.length);
	// 		var rst = {data: docs};
	// 		resCb(_.merge(rst, cfg.rst.SUCC));
	// 	}
	// });
};

function checkKeyWords() {
	log.debug('--------------- checkKeyWords --------');

}