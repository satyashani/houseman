/* ************************************************************* 
 * 
 * Date: Feb 10, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */
var db = require('mysql').createConnection({
    host     : 'localhost',
    database : 'mydb',
    user     : 'root',
    password : 'rewq12'
});
module.exports = db;