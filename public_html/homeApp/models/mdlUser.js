/* * ************************************************************ 
 * 
 * Date: 6 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file user.js
 * 
 * 
 * *************************************************************** */


var db = require("./db");
var crypto = require('crypto');
var dbname = 'users';

var crypt = function(pass){
    return crypto.createHash('md5').update("xTrEm35A1t"+pass).digest('hex');
};

var mdlUser = {
    validate : function(u,p,callback){
        var q = "SELECT * FROM " + dbname+ " WHERE username = '"+u+"'";
        db.getRow(q,function(row){
            if(row.id && row.password && row.password == crypt(p)){
                delete row.password;
            }
            callback(row)
        })
    },
    create : function(username,pass,name,role, callback){
        var q = "INSERT INTO " + dbname+ " (username,password,name,role) values( '"+username+"','"+crypt(pass)+"','"+name+"',"+role+")";
        console.log(q);
        db.insert(q,function(id){
            callback(id)
        });
    }
}


module.exports = mdlUser;