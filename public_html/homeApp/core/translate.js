/* ************************************************************* 
 * 
 * Date: Feb 14, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */
var http = require("http");
String.prototype.lang = function(){
    if(this.match(/[\u0900-\u097F]+/i))
        return "hi";
    else
        return "en";
}

var translate = {
    t: function(str,callback){
        if(str.lang()=="en")
            translate.e2h(str,callback);
        else
            translate.h2e(str,callback);
    },
    e2h: function(q,callback){
        http.get("http://inputtools.google.com/request?text="+q+"&itc=hi-t-i0-und&num=13&cp=0&cs=0&ie=utf-8&oe=utf-8",function(res){
            var d = "";
            res.on("data",function(data){
                d+=data;
            }).on("end",function(){
                var trans = JSON.parse(d);
                if(trans[0] && trans[0] == "SUCCESS"){
                    console.log(trans[1][0][1][0]);
                    callback(trans[1][0][1][0]);
                }
                else{
                    console.log("Error is translation - "+d);
                    callback("");
                }
            })
        }).on("error",function(e){
            console.log("Error in translation : "+ e.message);
            callback("");
        })
    },
    h2e: function(q,callback){
        http.get("http://translate.google.com/translate_a/t?client=t&sl=hi&tl=en&hl=en&sc=2&ie=UTF-8&oe=UTF-8&oc=1&otf=2&trs=1&inputm=1&srcrom=1&ssel=0&tsel=0&q="+q,function(res){
            var d = "";
            res.on("data",function(data){
                d+=data;
            }).on("end",function(){
                    while(d.match(/,\s*,/))
                        d = d.replace(/,\s*,/g,',"",')
                    var trans = JSON.parse(d);
                    if(trans[0] && trans[0][0] && trans[0][0][0]){
                        console.log( trans[0][0][0]);
                        callback(trans[0][0][0]);
                    }
                    else{
                        console.log("Error is translation - "+d);
                        callback("");
                    }
                })
        }).on("error",function(e){
                console.log("Error in translation : "+ e.message);
                callback("");
        })
    }
}
module.exports = translate;