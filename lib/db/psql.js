var pg = require('pg');
var cfg = require('../../cfg.js');

var psql = {
  _pool: null,
  init: function(config) {
    this._initPool(config);
  },
  _initPool: function(config) {
    console.log('------ this._initPool ------');
    this._pool = new pg.Pool(config);

    this._pool.on('error', function(err, client) {
      console.error('idle client error', err.message, err.stack);
    });
  },
  search: function(sqlStr, key, cb) {
    console.log('== key == ' + key);
    this.pool.connect(function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      client.query(sqlStr, function(err, result) {
        console.log('-------------clien -------- ' + key);

        //call `done()` to release the client back to the pool
        done();

        if (err) {
          return console.error('error running query', err);
        }
        console.log(result.rows[0].school);
        // console.log(result.rows[0].number);
        //output: 1
        // client.end(function() {
        //   console.log('===== client end ======= ' + key);
        // });
        console.log('--------- client over --------- ' + key);
      });
    });
  },

  search1: function(sqlStr, cb) {
    this._pool.query(sqlStr, function(err, res) {
      cb && cb(err, res);
      // console.log(res);
      // console.log(res.rows[0].school); // brianc
    })
  }

}

module.exports = psql;