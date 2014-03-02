/* * ************************************************************ 
 * 
 * Date: 2 Mar, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file index.js
 * 
 * 
 * *************************************************************** */



var http = require('http');
var app = require("./app");
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
