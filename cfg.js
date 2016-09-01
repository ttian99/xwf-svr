var bunyan = require('bunyan-daily');

var cfg = {
	projName: null,  // 项目名称
  	dbname: null, // 数据库名称
  	dbtype: null, // 数据库类型
	port: 8010, // 端口
	isDev: false, // 是否在调试模式下
	init: function(argv) {
		this._initDefProj();
		this._initCommCfg();
		this._initCmdArgvs(argv);
		this._initRstCode();
		this._initLog();
		this._initDb();
	},

	_initDefProj: function () {
		var def = require('./project.json');
		this.projName = def.projName;
		console.log("this.projName = " + this.projName)
	},

	_initCmdArgvs: function(argv) {
		this.projName = argv.pname || this.projName;
		this.dbname = argv.dbname || this.dbname;
		this.dbtype = argv.dbtype || this.dbtype;
		this.port = argv.port || this.port;
		this.isDev = argv.isDev || this.isDev;
	},

	_initLog: function() {
		bunyan.init({
			daily: {
				dir: 'logs/' + this.projName
			}
		});
	},

	_initRstCode: function() {
		var rstCode = require('./lib/client-svr-cfg/rst-code-def.js');
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
		var commCfg = require('./lib/client-svr-cfg/'+ this.projName + '-comm-cfg.js');
		commCfg(cfg);
	},

	log: function (name){
		return bunyan.logger(name);
	}
};

module.exports = cfg;