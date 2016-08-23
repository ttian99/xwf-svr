var express = require('express');
var router = express.Router();
var cfg = require('../../cfg.js');
var log = cfg.log('api-router');
var glob = require('glob-all');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');

var cmds = {};

// var pathname = __dirname + '/../api/**/*.js';
var pathname = __dirname + '/../api/'+ cfg.projName + '/**/*.js';
log.debug('pathname = ' + pathname);

// 遍历对应的协议文件
var path = require('path');
var files = glob.sync(pathname);
files.forEach(function(file) {
  var extname = path.extname(file);
  var basename = path.basename(file, extname);
  cmds[basename] = require(file);
  log.debug('register api: ' + basename);
});

// post请求
router.post('/', function(req, res) {
  log.debug('-- post --');
  var body = req.body;
  routerToCmd(body, res);
});

// get请求
router.get('/', function(req, res) {
  log.debug('-- get --');
  var body = req.query;
  routerToCmd(body, res);
});

// 路由到对应api文件
function routerToCmd(body, res) {
  log.debug('body = ' + JSON.stringify(body));
  if (body && body.cmd && cmds[body.cmd]) {
    var begTime = moment();
    cmds[body.cmd](body, function(rst) {
      var svrSpendTime = (moment().valueOf() - begTime.valueOf());
      if (svrSpendTime >= 2000) {
        log.warn(body, 'svrSpendTime', svrSpendTime);
      }
      res.json(_.merge(rst, {
        svrSpendTime: svrSpendTime
      }));
    });
  } else {
    log.warn(body, 'unknown cmd');
    // res.json(cfg.rst.UNKNOWN_CMD);
  }
}

module.exports = router;