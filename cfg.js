var bunyan = require('bunyan-daily');

var cfg = {
	projName: '',  // 项目名称
  	dbname: null, // 数据库名称
  	dbtype: '', // 数据库类型
	port: 8010, // 端口
	isDev: false, // 是否在调试模式下
	init: function(argv) {
		this._initLog();
		this._initCmdArgvs(argv);
		this._initRstCode();
		this._initCommCfg();
		this._initDb();
	},

	_initCmdArgvs: function(argv) {
		this.log('cfg').debug('projName = ' + argv.pname);
		this.log('cfg').debug('dbname = ' + argv.dbname);
		this.log('cfg').debug('dbtype = ' + argv.dbtype);
		this.log('cfg').debug('port = ' + argv.port);
		this.log('cfg').debug('isDev = ' + argv.isDev);
		this.projName = argv.pname;
		this.dbname = argv.dbname;
		this.dbtype = argv.dbtype;
		this.port = argv.port;
		this.isDev = argv.isDev;
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
		if (this.dbtype == 'mongo') {
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