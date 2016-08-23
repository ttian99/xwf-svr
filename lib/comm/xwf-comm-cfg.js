var xwfCommCfg = function (cfg) {
  // 服务器地址
  if (cfg.isDev) {
    cfg.svrUrl = 'http://localhost:8010/';
  } else {
    cfg.svrUrl = 'http://localhost:8010/';
  }

  // 小区对应学校的数据
  // var svData = require('./xwf-sv-cfg.js');
  // svData(cfg);
  // console.log("cfg.sv.lenght = " + cfg.svData.lenght);
};

if (typeof(module) !== 'undefined') {
  module.exports = xwfCommCfg;
}