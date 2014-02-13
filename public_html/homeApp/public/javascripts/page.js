/* * ************************************************************ 
 * 
 * Date: 12 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file page.js
 * 
 * 
 * *************************************************************** */

var suggest = function(input,otherData,url){
	$.get(url,otherData,function(data){
		var list = $("<div class='></div>")
	});
}
var xraySearchBaseTerm = "";
$("input#search").keyup(function(e){
	var term = $(this).val(), list = $('div#suggest li'), items = list.size();
	var code = e.keyCode||e.which;
	if(code===13 && $('li.infocus a').size())
		window.location = $('li.infocus a').attr("href");
	if(code===27)
		$("div#suggest").empty();
	if(code===40){
		var added = false;
		list.each(function(i){
			if($(this).hasClass("infocus") && i < list.size() - 1 && !added){
				$(this).removeClass("infocus").next().addClass("infocus");
				added = true;
			}
		});
		if(!added) list.removeClass("infocus").eq(0).addClass("infocus");
	}
	if(code===38){
		var added = false;
		list.each(function(i){
			if($(this).hasClass("infocus") && i > 0 && !added){
				$(this).removeClass("infocus").prev().addClass("infocus");
				added = true;
			}
		});
		if(!added) list.removeClass("infocus").eq(list.size()-1).addClass("infocus");
	}
	if(xraySearchBaseTerm&&term.match(new RegExp("^"+xraySearchBaseTerm)) && items>0)
		return;
	if(term.length>2&&code>=65){
		var action = $(this).parents('form').attr("action");
		$.get(action+"?term="+term,function(data){
			if(data.length){
				if(data.length<10){
					xraySearchBaseTerm = term;
				}
				$("div#suggest").empty();
				var list = $("<ul class='dropdown-menu' style=''></ul>");
				data.forEach(function(v){
					list.append($("<li><a href='"+v.url+"'>"+v.key+"</a></li>"));
				});
				$("div#suggest").append(list);
				list.fadeIn('fast');
			}
		});
	}
}).click(function(){
	$("div#suggest").empty();
});