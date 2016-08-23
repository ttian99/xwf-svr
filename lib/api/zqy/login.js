var Base = require('../../model/user-model.js');
var Info = require('../../model/info-model.js');
var cfg = require('../../../cfg.js');
var log = cfg.log('login');

module.exports = function login(body, resCb) {
	log.info('-------- start ---------');
	var uid = 'zqy-001';
	Base.findOne({
		uid: uid
	}, function(err, doc) {
		if (err) {
			log.error('------ there is some err = ' + err.stack);
			resCb(err);
		} else {
			doc ? userExist(doc, resCb) : createNewUser(uid, resCb);
		}
	});
};


function userExist(doc, cb) {
	log.info('------ userExist ----------');
	doc.lastLoginTime = new Date();

	log.debug('the doc : ', doc);
	doc.save();
	cb(cfg.rst.SUCC);
}

function createNewUser(uid, cb) {
	log.info('--------- createNewUser -------');
	var doc = new Base({
		uid: uid,
		nick: '测试1',
		lvl: 0,
	});
	doc.save();
	log.info('-------- over ---------');
	cb(cfg.rst.SUCC);
}