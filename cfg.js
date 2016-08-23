var bunyan = require('bunyan-daily');

var cfg = {
	isDev: false, // 是否在调试模式下
	projName: 'xwf',  // 项目名称
  	dbname: null, // 数据库名称
  	dbType: '', // 数据库类型

	init: function (dbname){
		this.dbname = dbname;
		this._initLog();
		this._initRstCode();
		this._initDb();
		this._initCommCfg();
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
		var mongoCfg = require('./lib/comm/mongo-def.js');
		mongoCfg(cfg);
	},

	_initPsql: function() {
		var psqlCfg = require('./lib/comm/postsql-def.js');
		psqlCfg(cfg);
	},

	_initCommCfg: function () {
		var commCfg = require('./lib/comm/'+ this.projName + '-comm-cfg.js');
		commCfg(cfg);
	},

	log: function (name){
		return bunyan.logger(name);
	}
};

module.exports = cfg;