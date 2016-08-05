var mongoose = require('mongoose');

/**
 * 连接mongodb数据库
 * @param {String} mongoUri - 连接字符串格式为mongodb://主机/数据库名
 * @param {Object} mongoOpt - 
 */
exports.connectMongo = function (mongoUri, mongoOpt, cb) {
	mongoose.connect(mongoUri, mongoOpt, function(err) {
		if (err) {
			cb && cb(err);
		} else {
			cb && cb(null, mongoUri);
		}
	});
}