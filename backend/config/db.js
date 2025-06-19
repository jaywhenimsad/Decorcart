const mysql = require('mysql2/promise');


const mySqlPool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'decorcart'

})

module.exports = mySqlPool;
