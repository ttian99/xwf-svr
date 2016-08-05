var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

// 上报信息
var infoSchema = new Schema({
  createTime: { type: Date, default: Date.now },  // 创建时间
  modifyTime: { type: Date, default: Date.now }, //修改时间
  userId: String, // 上报信息的用户id
  userNick: String, //上报信息的用户昵称
  num: {type: Number, default: 0 }, // 组件的数量
  type: String, //组件的类型
});

infoSchema.plugin(mToObject, { hide: '_id __v' });
infoSchema.index({
  createTime: 1
});

infoSchema.index({
  modifyTime: 1
});

module.exports = mongoose.model('Info', infoSchema);