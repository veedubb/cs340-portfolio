const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit :   10,
    host            :   'classmysql.engr.oregonstate.edu',
    user            :   'cs340_verleyt',
    password        :   '2676',
    database        :   'cs340_verleyt'
})

module.exports.pool = pool;