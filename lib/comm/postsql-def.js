var postsqlDef = function(cfg) {
  if (cfg.isDev) {
    cfg.psql = {
      user: 'jiao', //env var: PGUSER
      database: 'jiaodb', //env var: PGDATABASE
      password: 'hhan77', //env var: PGPASSWORD
      port: 5432, //env var: PGPORT
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
  } else {
    cfg.psql = {
      user: 'ubuntu', //env var: PGUSER
      database: 'xwfdb', //env var: PGDATABASE
      password: '123', //env var: PGPASSWORD
      port: 5432, //env var: PGPORT
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
  }
};

module.exports = postsqlDef;