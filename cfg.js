var bunyan = require('bunyan-daily');

var cfg = {
	isDev: false, // 是否在调试模式下
  	dbname: null, // 数据库名称
  	mongo: { uri: null, options: { db: { safe: true } } }, // mongo数据

	init: function (dbname){
		this.dbname = dbname;
		this._initLog();
		this._initMongo();
		console.log('this is init of cfg: ' + JSON.stringify(cfg, "", 4));
	},

	_initLog: function() {
		bunyan.init({
			daily: {
				dir: 'logs/' + this.dbname
			}
		});
	},

	_initMongo: function() {
		var dbUri = 'mongodb://localhost/';
		if (this.isDev) {
			dbUri = 'mongodb://192.168.1.176/';
		}
		this.mongo.uri = dbUri + this.dbname;
	},

	log: function (name){
		return bunyan.logger(name);
	}
};

module.exports = cfg;