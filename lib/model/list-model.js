var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

var recordSchema = new Schema({ 
  time: { type: Date, default: Date.now }, // 实验时间
  ctx: String // 实验内容 context
});

recordSchema.plugin(mToObject, { hide: '__v' });

// 上报信息
var listSchema = new Schema({
  orderId: String, // 流水号-唯一的识别id，从创建数据时的_id获得
  createTime: { type: Date, default: Date.now },  // 创建时间
  createUid: String, // 上报信息的用户id
  createNick: String, //上报信息的用户昵称
  modifyTime: { type: Date, default: Date.now }, //修改时间
  modifyUid: String, // 修改信息的用户id
  modifyNick: String, // 修改用户的昵称
  /**------------- 上面的信息暂时不使用只是预留 ------------**/
  goodsName: String, // 物件的名称
  mfr: String, // 厂家 manufacturer
  goodsMod: String, // 物件的型号 goods model
  tester: String, // 实验员
  accExe: String,// 客户代表       Account Excutive
  goodsNum: {type: Number, default: 0 }, // 物件的数量
  recordList: [recordSchema], // 操作纪录record list
  desc: {type: String, default: ''}, // 备注
});

listSchema.plugin(mToObject, { hide: '__v' });
listSchema.index({
  createTime: -1
});

listSchema.index({
  modifyTime: -1
});

module.exports = mongoose.model('List', listSchema);