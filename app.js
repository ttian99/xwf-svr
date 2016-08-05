// 初始化配置文件
var cfg = require('./cfg.js');
cfg.init('zqy');

// app日志
var log = cfg.log('app');
log.debug('cfg :', cfg);

// 初始化express 
var express = require('express');
var app = express();
var expressUtil = require('./lib/express/init-express.js');
expressUtil.init(app);

// 连接mongoDb数据库
var mongo = require('./lib/db/init-mongo.js');
mongo.connectMongo(cfg.mongo.uri, cfg.mongo.options, function (err, mongoUri){
	if (err) 
		log.error(err.stack);
	log.debug('mongo uri: ' + mongoUri);
});

// 监听process的异常
process.on('uncaughtException', function (e) {
  log.error('process Caught exception: ' + e.stack);
});

// 选择路由
app.use('/', require('./lib/router/api-router.js'));


// 服务器监听 
var server = app.listen(8010, function () {
  var host = server.address().address;
  var port = server.address().port;

  log.debug('svr is listening at http://%s:%s', host, port);
});
