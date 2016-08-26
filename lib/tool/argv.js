var argv = require('commander');

function parseName(val) {
  console.log('val = ' + val);
  return val;
}

argv
  .version('1.0.0')
  .usage('[options] [value ...]')
  .option('-n, --pname <n>', 'project name')
  .option('-b, --dbname <db>', 'database name')
  .option('-t, --dbtype <dbtype>', 'database type')
  .option('-p, --port <n>', 'listen port', parseInt)
  .option('-d, --dev', 'in dev mode')
  .parse(process.argv);

module.exports = argv;