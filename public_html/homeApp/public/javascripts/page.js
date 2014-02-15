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

function suggest(input,otherData,url){
	input.autocomplete({
		params: otherData,
		serviceUrl: url,
		
	});
};

function allocate(){
	$("form#allocate input#area").change(function(){
		$.get("/suggest/number",{
			type: $("form#allocate input#type").val(),
			area: $("form#allocate input#area").val()
		},function(data){
			$("form#allocate select#number").empty();
			data.suggestions.forEach(function(d){
				$("form#allocate select#number").append($("<option value='"+d.data+"'>"+d.value+"</option>"));
			});
		});
	});
}

function formvalidate(obj){
	var inputs = $(obj).find('input'),p1="";
	for(var i=0;i<inputs.size();i++){
		var inp = inputs.eq(i);
		var req = inp.attr('required');
		if(req && !inp.val()){
			showtip(inp,"Required!!");
			return false;
		}
		if(inp.attr("type") === 'email' && !inp.val().match(/.+@.+\.[A-z]{2,6}$/i)){
			showtip(inp,"Invalid Email!!");
			return false;
		}
		if(inp.attr("type") === 'password'){
			var v = inp.val();
			if(!v.match(/.{6,}/)){
				showtip(inp,"Minimum 6 characters!!");
				return false;
			}
			if(!v.match(/[0-9]+/)){
				showtip(inp,"At least one number required!!");
				return false;
			}
			if(!v.match(/[^0-9]+/)){
				showtip(inp,"At least one character required!!");
				return false;
			}
			if(p1 && v !== p1){
				showtip(inp,"Passwords don't match!!");
				return false;
			}else
				p1 = v;
		}
	}
	return true;
}

function showtip(obj,tip){
    $(obj).tooltip({show: 200, hide: 100, placement: "auto", container: "body", title: tip}).tooltip("show");
    window.setTimeout(function(){(obj).tooltip('destroy')},2000);
}

function ajaxform(e){
	e.preventDefault();
	if(!formvalidate(this))
		return false;
	var method = $(this).attr("method");
	$.fancybox.showLoading();
    var outdiv = $(this).find("div.ajaxoutput");
	$.ajax({
		url: $(this).attr("action"),
		data : $(this).serialize(),
		type : method?method:"GET",
		success: function(data){
			$.fancybox.hideLoading();
			outdiv.html(data).fadeIn('fast');
			window.setTimeout(function(){outdiv.fadeOut('fast').empty();},10000);
		},
		error: function(x,t,s){
			$.fancybox.hideLoading();
			outdiv.html(s).fadeIn('fast');
		}
	});
};

$(document).ready(function(){
	$("input[suggesturl]").each(function(){
		$(this).autocomplete({
			serviceUrl: $(this).attr("suggesturl")
		});
	});
	$("form.ajaxform").submit(ajaxform);
	$('form').each(function(){
		var f = eval($(this).attr("id"));
		if(typeof f  === "function")
			f.call(this);
	});
});