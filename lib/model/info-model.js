var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

// 上报信息
var infoSchema = new Schema({
  orderId: String, // 流水号-唯一的识别id，从创建数据时的_id获得
  createTime: { type: Date, default: Date.now },  // 创建时间
  createUid: String, // 上报信息的用户id
  createNick: String, //上报信息的用户昵称
  modifyTime: { type: Date, default: Date.now }, //修改时间
  modifyUid: String, // 修改信息的用户id
  modifyNick: String, // 修改用户的昵称
  /**------------- 上面的信息暂时不使用只是预留 ------------**/
  time: { type: Date, default: Date.now }, // 收件时间
  mfr: String, // 厂家 manufacturer
  epsCnee: String, // 快递收货人 express consignee 
  trueCnee: String, // 真实收件人 true consignee
  goodsName: String, // 物件的名称
  goodsNum: {type: Number, default: 0 }, // 物件的数量
  goodsMod: String, // 物件的型号 goods model
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