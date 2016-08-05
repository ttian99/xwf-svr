var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

// 用户信息
var baseSchema = new Schema({
  createTime: { type: Date, default: Date.now },  // 创建时间
  uid: {type: String, unique: true}, // 用户唯一标示，象棋前端为对应的qq号
  nick: String, // 昵称(可选)
  face: String,  // 头像(可选)
  isGirl: Boolean, // 性别(可选)
  lvl: Number, // 权限等级

  // 上一次登陆时间
  lastLoginTime: { type: Date, default: Date.now },
});
baseSchema.plugin(mToObject, { hide: '_id __v' });
baseSchema.index({
  createTime: 1
});
// 从大到小
baseSchema.index({
  weeklyScore: -1
});


module.exports = mongoose.model('Base', baseSchema);