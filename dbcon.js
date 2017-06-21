var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_fatehie',
  password        : '3610',
  database        : 'cs290_fatehie',
  dateStrings	  : 'date'
});

module.exports.pool = pool;
