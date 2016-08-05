var Base = require('../model/user-model.js');
var Info = require('../model/Info-model.js');
var cfg = require('../../cfg.js');
var log = cfg.log('login');

module.exports = function login() {
	log.info('-------- start ---------');
	var uid = 'zqy-001';
	Base.findOne({
		uid: uid
	}, function(err, doc) {
		if (err) {
			log.error('------ there is some err = ' + err.stack);
		} else {
			doc ? userExist(doc) : createNewUser(uid);
		}
	});
};


function userExist(doc) {
	log.info('------ userExist ----------');
	doc.lastLoginTime = new Date();
	doc.save();
}

function createNewUser(uid) {
	log.info('--------- createNewUser -------');
	var doc = new Base({
		uid: uid,
		nick: '测试1',
		lvl: 0,
	});
	doc.save();
	log.info('-------- over ---------');
}