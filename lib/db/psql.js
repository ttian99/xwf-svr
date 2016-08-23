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

  search1: function(sqlStr, key, cb) {
    this._pool.query(sqlStr, function(err, res) {
      cb && cb(err, res);
      // console.log(res);
      console.log(res.rows[0].school); // brianc
    })
  }

}

module.exports = psql;

// this.pool.query(sqlStr, function(err, result) {
//   console.log('------- test ----------');
//   if (err) {
//     console.log('err' + err.stack);
//     cb && cb(err);
//   } else {
//     console.log(result.rows[0])
//     cb(null, result);      
//   }
// });

// psql.init(config);
// psql.search1(sqlStr, '1', function (){
//   console.log('------ back1 -------');
// });
// psql.search1(sqlStr, '2', function (){
//   console.log('------ back2 -------');
// });
// psql.search1(sqlStr, '3', function (){
//   console.log('------ back3 -------');
// });
// psql.search1(sqlStr, '4', function (){
//   console.log('------ back4 -------');
// });
// psql.search1(sqlStr, '5', function (){
//   console.log('------ back5 -------');
// });
// pool.connect(function(err, client, done) {
//   if(err) {
//     return console.error('error fetching client from pool', err);
//   }
//   // client.query(sqlStr, ['1'], function(err, result) {
//   //   console.log('-------------clien -------- ');

//   //   //call `done()` to release the client back to the pool
//   //   done();

//   //   if(err) {
//   //     return console.error('error running query', err);
//   //   }
//   //   console.log(result.rows[0].number);
//   //   //output: 1
//   // });

//   client.query(sqlStr, function(err, result) {
//     console.log('-------------clien -------- ');

//     //call `done()` to release the client back to the pool
//     done();

//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log(result);
//     // console.log(result.rows[0].number);
//     //output: 1

//     client.end();
//     console.log('--------- client over ---------');
//   });
// });


// pool.on('error', function (err, client) {
//   // if an error is encountered by a client while it sits idle in the pool
//   // the pool itself will emit an error event with both the error and
//   // the client which emitted the original error
//   // this is a rare occurrence but can happen if there is a network partition
//   // between your application and the database, the database restarts, etc.
//   // and so you might want to handle it and at least log it out
//   console.error('idle client error', err.message, err.stack)
// })
