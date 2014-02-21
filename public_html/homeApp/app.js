
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var hview = require("./core/view");
var homeUtil = require("./core/homeUtil");
var routes = {
	index: require('./routes/index'),
	suggest: require('./routes/suggest'),
    quarters: require('./routes/quarters'),
    person: require('./routes/person')
}
app = express();
model = {
	/**
	 * 
	 * @type mdlUser
	 */
	user: require("./models/mdlUser"),
	/**
	 * 
	 * @type mdlQuarter
	 */
	quarter: require("./models/mdlQuarter"),
    /**
     *
     * @type mdlPerson
     */
    person: require("./models/mdlPersons"),
	/**
	 * 
	 * @type mdlAllocate
	 */
	allocate: require("./models/mdlAllocate")
};
translate = require("./core/translate");
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function(req,res,next){
    if(req.query.lang) req.session.lang = req.query.lang;
    if(!req.session.lang) req.session.lang = "en";
    /**
     * @type {view}
     */
    req.view = new hview(req);
    next();
})
app.use(function(req,res,next){
    console.log(req.host);
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.locals.sidebar = [];
for(var i in routes){
    if(typeof routes[i].routes === "function")
        routes[i].routes(app);
}
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
