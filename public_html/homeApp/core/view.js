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

var view = function(req){
	this.req = req;
	this.js = [];
	this.css = [];
	this.addCss("style.css");
	this.addCss("bootstrap.min.css");
    this.addCss("jquery.fancybox.css");
    this.addCss("jquery-ui-1.10.2.custom.min.css");
	this.addCss("bootstrap-theme.min.css");
	this.addJs("d3.v3.min.js");
	this.addJs("jquery.min.js");
    this.addJs("jquery-ui-1.10.3.custom.min.js");
	this.addJs("jquery.autocomplete.min.js");
	this.addJs("fancybox2/source/jquery.fancybox.js");
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
			{ 'link' : "/list/quarters", "label" : "Quarters"}
		]
	};
//    var searchbar = this.getHtml("search",{
//        "action" : "/search",
//        "search_string" : "Search"
//    });
	data.js = this.js;
	data.css = this.css;
	if(!data.title)
		data.title = "Express";
	if(!data.topMenu)
		data.topMenu = this.getHtml("dropDown",{list : menu});
    if(!data.searchbar)
        data.searchbar = "";
	if(!data.topOptions)
		data.topOptions = "";
    if(!data.sidebar)
        data.sidebar = this.getHtmlSidebar(this.getSidebar());
	if(!data.content)
		data.content = "";
	return this.getHtml("index",data);
};

view.prototype.getSidebar = function(){
    if(!app.locals.sidebar)
        app.locals.sidebar = [
            { "link" : "/quarters/addnew", label: "Add new quarter"},
            { "link" : "/quarters/allocate", label: "Allocate"}
        ];
    return app.locals.sidebar;
}

view.prototype.getHtmlSidebar = function(sidebar){
    return this.getHtml("sidebar",{options: sidebar});
}

view.prototype.getSuccess = function(title,msg){
    return this.getHtml("message",{type: "success", title: title, msg: msg});
}

view.prototype.getError = function(title,msg){
    return this.getHtml("message",{type: "error", title: title, msg: msg});
}

module.exports = view;