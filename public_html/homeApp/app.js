
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var hview = require("./core/view");

var routes = {
	index: require('./routes/index'),
	suggest: require('./routes/suggest'),
    quarters: require('./routes/quarters')
}
var app = express();
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
	 * @type mdlLocations
	 */
	locations: require("./models/mdlLocations"),
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
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index.index);
app.get('/suggest/type', routes.suggest.type);
app.get('/suggest/location', routes.suggest.location);
app.get('/suggest/number', routes.suggest.number);
app.post('/quarters/addnew', routes.quarters.addNew);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
