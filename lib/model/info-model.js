var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

// 上报信息
var infoSchema = new Schema({
  orderId: String, // 流水号-唯一的识别id，从创建数据时的_id获得
  createTime: { type: Date, default: Date.now },  // 创建时间
  modifyTime: { type: Date, default: Date.now }, //修改时间
  userId: String, // 上报信息的用户id
  userNick: String, //上报信息的用户昵称
  goodsName: String, // 物件的名称
  goodsNum: {type: Number, default: 0 }, // 物件的数量
  goodsType: String, // 物件的类型
  desc: {type: String, default: ''}, // 备注
});

infoSchema.plugin(mToObject, { hide: '__v' });
infoSchema.index({
  createTime: 1
});

infoSchema.index({
  modifyTime: 1
});

module.exports = mongoose.model('Info', infoSchema);