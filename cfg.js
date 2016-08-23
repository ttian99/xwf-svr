var bunyan = require('bunyan-daily');

var cfg = {
	isDev: false, // 是否在调试模式下
  	dbname: null, // 数据库名称
  	mongo: { uri: null, options: { db: { safe: true } } }, // mongo数据
  	dbType: 'mongo', // 数据库类型

	init: function (dbname){
		this.dbname = dbname;
		this._initLog();
		this._initRstCode();
		this._initDb();
	},

	_initLog: function() {
		bunyan.init({
			daily: {
				dir: 'logs/' + this.dbname
			}
		});
	},

	_initRstCode: function() {
		var rstCode = require('./lib/comm/rst-code-def.js');
		rstCode(cfg);
	},

	_initDb: function() {
		if (this.dbType == 'mongo') {
			this._initMongo();
		} else {
			this._initPsql();
		}
	},

	_initMongo: function() {
		var dbUri = 'mongodb://localhost/';
		if (this.isDev) {
			dbUri = 'mongodb://192.168.1.176/';
		}
		this.mongo.uri = dbUri + this.dbname;
	},

	_initPsql: function() {
		var psql = require('./lib/comm/postsql-def.js');
		psql(cfg);
	},



	log: function (name){
		return bunyan.logger(name);
	}
};

module.exports = cfg;