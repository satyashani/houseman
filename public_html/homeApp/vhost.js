/* * ************************************************************ 
 * 
 * Date: 20 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file vhost.js
 * 
 * 
 * *************************************************************** */


/**
* Module dependencies.
*/

var express = require('express');

// Redirect app

var house = require("./app");
house.all("*",function(req, res){
  console.log(req.subdomains);
  res.redirect('localhost:3000/' + req.subdomains[0]);
});
// Vhost app

var app = express();

app.use(express.vhost('house', house)) // Serves all subdomains via Redirect app

app.listen(3000);