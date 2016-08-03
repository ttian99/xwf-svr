// 初始化配置文件
var cfg = require('./cfg.js');
cfg.init('zqy');

// 初始化express 
var express = require('express');
var app = express();

// 连接mongoDb数据库
var mongo = require('./lib/db/initMongodb.js');
mongo.connectMongo(cfg.mongo.uri, cfg.mongo.options);



// 监听process的异常
process.on('uncaughtException', function (e) {
  // log.fatal('process Caught exception: ' + e.stack);
  console.log('process Caught exception: ' + e.stack);
});


app.get('/', function (req, res) {
  res.send('Hello World!');
  res.end();
});

// 服务器监听 
var server = app.listen(8010, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
