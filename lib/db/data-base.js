var mongoose = require('mongoose');
var cfg = require('../../cfg.js');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

var bagSchema = new Schema({ id: Number, num: Number });
var heroesSchema = new Schema({ id: Number, lvl: Number });
var friendsSchema = new Schema({ openid: String, cd: Date });

var baseSchema = new Schema({
  openid: { type: String, unique: true },

  nick: String,
  isGirl: Boolean,
  face: String,  // 只截取一部分
  // 金币
  coin: { type: Number, default: cfg.comm.INIT_COIN },
  ios_coin: { type: Number, default: cfg.comm.INIT_COIN },
  // 钻石
  diam: { type: Number, default: cfg.comm.INIT_DIAM },
  ios_diam: { type: Number, default: cfg.comm.INIT_DIAM },
  // 背包中的道具
  bag: [bagSchema],
  ios_bag: [bagSchema],

  bestScore: { type: Number, default: 0 },  // 历史最高分数
  weeklyScore: { type: Number, default: 0 },// 本周最高分数，定时更新

  eggs: { type: Number, default: 0 }, // 背包中蛋的数量

  heroes: [heroesSchema],
  curHero: { type: Number, default: 0 },

  createTime: { type: Date, default: Date.now },
  lastLoginTime: { type: Date, default: Date.now },

  friends: [friendsSchema],
  retain: { type: Number, default: 0 }, // 留存

  sta: { type: Number, default: cfg.comm.DAY_INC_STA }, // 体力

  // 是否有每日礼包, 赠送礼包和5点体力
  haveDailyGift: { type: Boolean, default: true },
  // 是否做了每日分享，ture还未做
  haveDailyShare: { type: Boolean, default: true },
  // 是否有每日免费蛋
  haveDailyEgg: { type: Boolean, default: true },
  // 每日可免费送体力次数
  dailySendSta: { type: Number, default: cfg.comm.FREE_SEND_STA_COUNT },

  // 剩余每日世锦赛次数
  freeMatchTimes: { type: Number, default: cfg.comm.FREE_MATCH_TIMES },

  // 一周内连续登录天数
  weekLoginDaies: { type: Number, default: 0 },

  // 游戏开始和结束匹配临时对象，防止重入和作弊
  lastGameScene: String, // 'normal' or 'match'
  lastGameBegTime: Date,

  gameBegCount: Number,  // 游戏开始次数
  gameEndCount: Number   // 游戏结束次数
});

bagSchema.plugin(mToObject, { hide: '_id' });
heroesSchema.plugin(mToObject, { hide: '_id' });
friendsSchema.plugin(mToObject, { hide: '_id' });
baseSchema.plugin(mToObject, { hide: '_id __v' });

baseSchema.index({
  createTime: 1
});
// 从大到小
baseSchema.index({
  weeklyScore: -1
});

module.exports = mongoose.model('Base', baseSchema);