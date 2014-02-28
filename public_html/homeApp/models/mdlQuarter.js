/* * ************************************************************ 
 * 
 * Date: 6 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file mdlQuarter.js
 * 
 * 
 * *************************************************************** */

var db = require("./db");
var dbname = 'quarter';
var mdlQuarter = {
    getQuarter : function(type,location,number,callback){
        var q = "SELECT * FROM "+dbname;
        var cond = [];
        if(type) cond.push("type = '"+type.uniq()+"'");
        if(location) cond.push("location = '"+location.uniq()+"'");
        if(number) cond.push("number = '"+number.uniq()+"'");
        if(cond.length)
            q += " WHERE " + cond.join(" AND ");
        db.getRows(q,callback);
    },

    getById: function(id,callback){
        var q = "SELECT * FROM "+dbname+" WHERE id = "+id;
        db.getRow(q,callback);
    },

    search : function(type,location,status,searchterm,callback){
        var q= "SELECT  * from allquarters";
        var cond = [];
        if(type) cond.push("type = '"+type.uniq()+"'");
        if(location) cond.push("location = '"+location.uniq()+"'");
        if(status) cond.push("status = '"+status+"'");
        if(searchterm) cond.push("description like '%"+searchterm+"%'");
        if(cond.length)
            q += " WHERE " + cond.join(" AND ");
        db.getRows(q,callback);
    },

    getLocations : function(q,callback){
        var c = q?" WHERE location LIKE '%"+ q.uniq()+"%'":"";
        var sql = "SELECT DISTINCT location FROM "+dbname+c;
        db.getRows(sql,callback);
    },

    getTypes : function(callback){
        var q = "SELECT DISTINCT type FROM "+dbname;
        db.getRows(q,callback);
    },
    
    addQuarter : function(location,type,number,callback){
        var l = location.uniq(),t=type.uniq(),n=number.uniq();
        var q = "INSERT INTO "+dbname+" (type,location,number) values('"+t+"','"+l+"','"+n+"')";
        db.insert(q,callback);
    }
}

module.exports = mdlQuarter;