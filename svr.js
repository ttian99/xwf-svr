// 启动命令行文件
var argv = require('./lib/tool/argv.js');

// 初始化配置文件
argv.pname = argv.pname || 'xwf';
argv.dbname = argv.dbname || 'jiaodb';
argv.dbtype = argv.dbtype || 'postsql'
argv.port = argv.port || 8010;
argv.dev = !!argv.dev;
var cfg = require('./cfg.js');
cfg.init(argv);

// app日志
var log = cfg.log('svr');
log.debug(JSON.stringify(cfg), 'cfg : s%');

// 初始化express 
var express = require('express');
var app = express();
var expressUtil = require('./lib/express/init-express.js');
expressUtil.init(app);

// 数据库
if (cfg.dbtype == 'mongo') {
	// 连接mongoDb数据库
	var mongo = require('./lib/db/init-mongo.js');
	mongo.connectMongo(cfg.mongo.uri, cfg.mongo.options, function(err, mongoUri) {
		if (err)
			log.error(err.stack);
		log.debug('dbtype: mongo | uri: ' + mongoUri);
	});
} else {
	// 初始postsql数据库
	var psql = require('./lib/db/psql.js');
	psql.init(cfg.psql);
	log.debug('dbtype: postsql');
}


// 监听process的异常
process.on('uncaughtException', function (e) {
  log.error('process Caught exception: ' + e.stack);
});

// 选择路由
app.use('/', require('./lib/router/api-router.js'));


// 服务器监听 
var server = app.listen(cfg.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  log.debug('svr is listening at'+ host + ":"+ port);
});
