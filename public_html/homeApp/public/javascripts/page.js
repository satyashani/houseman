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

String.prototype.lang = function(){
    if(this=="" || this.match(/[\u0900-\u097F]+/i) && !this.match(/[a-z]+/i))
        return "hi";
    else
        return "en";
}

function suggest(input,otherData,url){
	input.autocomplete({
		params: otherData,
		serviceUrl: url
	});
};

var getSelectOpts = function(url,querydata,input){
    $.get(url,querydata,function(data){
        input.empty();
        if(data.suggestions && data.suggestions[0]){
            data.suggestions.forEach(function(d){
                input.append($("<option value='"+d.data+"'>"+d.value+"</option>"));
            });
            input.attr({'value' : data.suggestions[0].data});
            input.change();
        }
    });
}

var loadLocations = function(form){
    getSelectOpts("/suggest/number",{
        type: form.find("select#type").val(),
        location: form.find("select#location").val()
    },form.find("select#number"));
}

function allocate(){
    $("form#allocate select#location,form#allocate select#type").change(function(){
        loadLocations($(this).parents("form"));
    });
    $("form#allocate input#person").autocomplete({
        serviceUrl : "/person/selectlist",
        onSelect: function(s){
            $(this).text(s.value);
            $("form#allocate input#person_id").val(s.data);
        }
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
        var lang = inp.attr('lang');
        if(lang && inp.val().lang() !== lang){
            l = lang!='en'?"Hindi":"English";
            showtip(inp,"Only "+l+" input is accepted");
            return false;
        }
		if(inp.attr("type") === 'email' && inp.val() && !inp.val().match(/.+@.+\.[A-z]{2,6}$/i)){
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
        if(inp.hasClass("date")){
            var v = inp.val();
            if(v && (!v.match(/^\d{1,2}[\s|\/]+[a-z]{3,}[\s|\/]+[\d]{4}\s*/i) || isNaN(Date.parse(v)))){
                showtip(inp,"Date must be in the format dd Mon yyyy e.g. 10 Oct 2013");
                return false;
            }
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
    var outId = $(this).attr("id")+"_output";
    ajaxformProc(this,$("div#"+outId),true);
};

function ajaxformProc(form,outdiv,validate){
    if(validate && !formvalidate(form))
        return false;
    $.fancybox.showLoading();
    var method = $(form).attr("method");
    $.ajax({
        url: $(form).attr("action"),
        data : $(form).serialize(),
        type : method?method:"GET",
        success: function(data){
            $.fancybox.hideLoading();
            outdiv.html(data).slideDown('fast');
            applyCommonEvents(outdiv);
        },
        error: function(x,t,s){
            $.fancybox.hideLoading();
            outdiv.html(x.responseText).slideDown('fast');
        }
    });
};

function pagingLinkLoad(e){
    e.preventDefault();
    var list = $(this).parents("ul.pagination");
    var outId = list.attr("id")+"_output";
    var outdiv = $("div#"+outId);
    $.fancybox.showLoading();
    $.ajax({
        url: $(this).attr("href"),
        type : "POST",
        success: function(data){
            $.fancybox.hideLoading();
            outdiv.html(data).slideDown('fast');
            applyCommonEvents(outdiv);
        },
        error: function(x,t,s){
            $.fancybox.hideLoading();
            outdiv.html(x.responseText).slideDown('fast');
        }
    });
}

function setPaging(scope){
    var wrap = $(scope).find('div.pagination_wrapper'), list = wrap.find('li'),ul = wrap.find('ul.pagination');
    var l = list.size(),leftbtn = wrap.find('a.paging_left'),rightbtn = wrap.find('a.paging_right');
    var activeindex = ul.find('li.active').index();
    var itemstoleft = Math.floor(activeindex/20)*20,toleft= 0,wrapwidth=0;
    for(var i=0;i<(itemstoleft+21);i++){
        if(i<itemstoleft)
            toleft -= list.eq(i).find('a').outerWidth()-1;
        else{
            wrapwidth += i<l?list.eq(i).find('a').outerWidth():35;
        }
    }
    list.eq(itemstoleft).addClass("startpoint");
    wrap.animate({"width":wrapwidth});
    ul.css({"left" : toleft+"px"});
    ul.find("a").click(pagingLinkLoad);
    rightbtn.click(function(e){
        e.preventDefault();
        var startindex = ul.find('li.startpoint').index();
        if(l-startindex>=20){
            list.eq(startindex).removeClass("startpoint");
            var toleft = parseInt(ul.css("left"));
            for(var i=startindex;i<(startindex+20);i++){
                toleft -= list.eq(i).find('a').outerWidth()-1;
            }
            ul.animate({"left" : toleft+"px"});
            list.eq(i).addClass("startpoint");
        }
    });
    leftbtn.click(function(e){
        e.preventDefault();
        var startindex = ul.find('li.startpoint').index();
        if(startindex>=20){
            list.eq(startindex).removeClass("startpoint");
            var toleft = parseInt(ul.css("left"));
            for(var i=startindex-1;i>=(startindex-20);i--){
                toleft += list.eq(i).find('a').outerWidth()-1;
            }
            ul.animate({"left" : toleft+"px"});
            list.eq(i+1).addClass("startpoint");
        }
    })
}

var applyCommonEvents = function(scope){
    $(scope).find('form').each(function(){
        var f = eval($(this).attr("id"));
        if(typeof f  === "function")
            f.call(this);
    });

    $(scope).find("input[suggesturl]").each(function(){
        $(this).autocomplete({
            serviceUrl: $(this).attr("suggesturl")
        });
    });

    $(scope).find("select[suggesturl]").each(function(){
        getSelectOpts($(this).attr("suggesturl"),{},$(this));
    });

    $(scope).find("form.ajaxform").submit(ajaxform);
    $(scope).find("input.date").datepicker({dateFormat: "dd M yy" });

    $(scope).find("a.fancybox").click(function(e){
        e.preventDefault();
        var opts = {
            type: 'ajax',
            openSpeed	:	200,
            closeSpeed	:	200,
            afterShow: function(){
                applyCommonEvents(".fancybox-inner");
            }
        }
        $.fancybox.open({'href':$(this).attr("href")},opts);
    });

    $(scope).find("a#cancelAction").click(function(e){
        e.preventDefault();
        $.fancybox.close();
    });

    setPaging(scope);
}

$(document).ready(function(){
    applyCommonEvents('body');
});