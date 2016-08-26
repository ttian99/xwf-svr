var zqyCommCfg = function (cfg) {
  // 服务器地址
  if (cfg.isDev) {
    cfg.svrUrl = 'http://localhost:8010/';
  } else {
    cfg.svrUrl = 'http://localhost:8010/';
  }
};

if (typeof(module) !== 'undefined') {
  module.exports = zqyCommCfg;
}