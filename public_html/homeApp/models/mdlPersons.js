/* ************************************************************* 
 * 
 * Date: Feb 15, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */

var db = require("./db");
var dbname = 'person';
var mdlPerson = {

    getPersons : function(name,post,office,callback){
        var q = "SELECT * FROM "+dbname;
        var cond = [];
        if(name) cond.push("name like '%"+name+"%'");
        if(post) cond.push("post like '%"+post+"%'");
        if(office) cond.push("office like '%"+office+"%'");
        if(cond.length)
            q += " WHERE " + cond.join(" OR ");
        q += " LIMIT 15";
        db.getRows(q,callback);
    },

    getPosts : function(q,callback){
        var c = q?" WHERE post LIKE '%"+q+"%'":"";
        var sql = "SELECT DISTINCT post FROM "+dbname+c;
        db.getRows(sql,callback);
    },

    getOffices : function(q,callback){
        var c = q?" WHERE office LIKE '%"+q+"%'":"";
        var sql = "SELECT DISTINCT office FROM "+dbname+c;
        db.getRows(sql,callback);
    },

    getNames : function(q,callback){
        var c = q?" WHERE name LIKE '%"+q+"%'":"";
        var sql = "SELECT DISTINCT name FROM "+dbname+c;
        db.getRows(sql,callback);
    },

    addPerson : function(name,post,office,gender,email,phone,callback){
        var n = name.uniq(),p = post.uniq(),o = office.uniq(),e = email.trim().toLowerCase(),g=gender.toUpperCase().trim();
        var q = "INSERT INTO "+dbname+" (name,post,office,gender,email,phone) values('"+n+"','"+p+"','"+o+"','"+g+"','"+e+"','"+phone+"')";
        db.insert(q,callback);
    }
}

module.exports = mdlPerson;