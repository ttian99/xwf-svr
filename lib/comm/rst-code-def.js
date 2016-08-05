/**
 * 返回码定义：
 *   code = 0: 正确返回
 *   code > 0: 业务逻辑错误
 *     code > 1000: 具体项目相关业务逻辑错误
 *   code < 0: 系统内部错误
 */
var rstCode = function (cfg) {
  cfg.rst = {
    SUCC: { code: 0, msg: 'succ' },
    EDB: { code: -1, msg: 'handle db error' },
    EPARAM: { code: -2, msg: 'param error' },
    UNKNOWN_CMD: { code: -3, msg: 'unknown cmd' },
    DOC_NULL: { code: -4, msg: 'not find doc from db' },
    EWANBA_API: { code: 1, msg: 'request wanba api failed' },
    EOTHER_API: { code: 2, msg: 'request other api failed' },
    RE_DO: { code: 1000, msg: 're do something' },
    NOT_ENOUGH: { code: 1001, msg: 'not enough' },
    BEYOND_LIMIT: { code: 1002, msg: 'beyond the limit ' }, // 超出上限
    HAVE_EXIST: { code: 1003, msg: 'have exist' }, // 某物品具有唯一性，只需购买一次，如英雄
    NOT_MATCH: { code: 1004, msg: 'not match' },  // 没有匹配上
    NOT_EXIST: { code: 1005, msg: 'not exist' }  // 不存在
  };
};

if (typeof(module) !== 'undefined') {
  module.exports = rstCode;
}