/* * ************************************************************ 
 * 
 * Date: 10 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file view.js
 * 
 * 
 * *************************************************************** */


var ejs = require('ejs');
var fs = require('fs');
var app = require("express")();

var view = function(req){
	this.req = req;
};

view.prototype.getHtml = function(template,vars){
	var path = app.get("views")+"/"+template+".ejs";
    console.log(path);
	if(!fs.existsSync(path)){
		console.log("File "+path+" not found while rendering.");
		return "";
	}
	return ejs.render(fs.readFileSync(path, 'utf8'),vars);
};

view.prototype.getPage = function(sections){
	var data = arguments.length?sections:{};
	var menu = {
		'link' : '/' , 'label' : 'Home', options: [
			{ 'link' : "/quarters", "label" : "Quarters"}
		]
	};
	if(!data.title)
		data.title = "Express";
	if(!data.topMenu)
		data.topMenu = this.getHtml("dropDown",{list : menu});
	if(!data.topOptions)
		data.topOptions = "";
    if(!data.sidear)
        data.sidebar = "";
	if(!data.content)
		data.content = "";
	return this.getHtml("index",data);
};

module.exports = view;