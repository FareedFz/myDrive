const mysql = require('mysql2');
let connection =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myDrive',
    multipleStatements: true
})
module.exports = connection;