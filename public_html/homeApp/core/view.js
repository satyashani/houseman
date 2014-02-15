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
	this.js = [];
	this.css = [];
	this.addCss("style.css");
	this.addCss("bootstrap.min.css");
	this.addCss("bootstrap-theme.min.css");
	this.addJs("d3.v3.min.js");
	this.addJs("jquery.min.js");
	this.addJs("jquery.autocomplete.min.js");
	this.addJs("fancybox2/source/jquery.fancybox.pack.js");
	this.addJs("bootstrap.min.js");
	this.addJs("page.js");
};

view.prototype.addJs = function(filename){
	this.js.push(filename);
};
view.prototype.addCss = function(filename){
	this.css.push(filename);
};

view.prototype.getHtml = function(template,vars){
	var path = app.get("views")+"/"+template+".ejs";
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
	data.js = this.js;
	data.css = this.css;
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

view.prototype.getSuccess = function(title,msg){
    return this.getHtml("message",{type: "success", title: title, msg: msg});
}

view.prototype.getError = function(title,msg){
    return this.getHtml("message",{type: "error", title: title, msg: msg});
}

module.exports = view;