const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'project-management',
    //debug: true,
});
