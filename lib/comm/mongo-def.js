var mongoDef = function(cfg) {
  if (cfg.isDev) {
    cfg.mongo = {
      uri: 'mongodb://localhost/'+ cfg.dbname,
      options: { db: { safe: true } }
    }
  } else {
    cfg.mongo = {
      uri: 'mongodb://localhost/' + cfg.dbname,
      options: { db: { safe: true } }
    }
  }
};

module.exports = mongoDef;