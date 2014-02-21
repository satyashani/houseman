/* ************************************************************* 
 * 
 * Date: Feb 17, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */
String.prototype.lang = function(){
    if(this.match(/[\u0900-\u097F]+/i) || !this.match(/[a-z]+/i))
        return "hi";
    else
        return "en";
};
String.prototype.capital = function(){
    return this.toUpperCase();
}
String.prototype.singleSpace = function(){
    var str = this;
    while(str.match(/  /))
        str = str.replace(/  /g,' ');
    return str;
}
String.prototype.uniq = function(){
    return this.singleSpace().capital().trim();
}