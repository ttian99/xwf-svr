var Base = require('../../model/user-model.js');
var Info = require('../../model/info-model.js');
var cfg = require('../../../cfg.js');
var log = cfg.log('search-info');
var _ = require('lodash');

module.exports = function searchInfo(body, resCb) {
	log.debug('search-info', body);
	var words = body.words || '哈哈';

	var qs = new RegExp(words);
	Info.find(
	{ $or: [
		{'epsCnee': {$regex: qs}},
		{'trueCnee': {$regex: qs}},
		{'goodsName': {$regex: qs}},
		{'goodsType': {$regex: qs}},
		{'mfr': {$regex: qs}}
		]
	}, function(err, docs) {
		if (!docs) {
			log.warn('doc is not find');
			resCb(cfg.rst.EDB);
		} else {
			log.debug('search-info success');
			// doc.remove();
			log.debug(docs.length);
			var rst = {data: docs};
			resCb(_.merge(rst, cfg.rst.SUCC));
		}
	});
};