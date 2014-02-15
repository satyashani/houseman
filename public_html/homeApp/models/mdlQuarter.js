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
    getRows : function(q,callback){
        db.query(q,function(err,rows){
            if(err) callback(err);
            else callback(rows);
        });
    },

    getQuarter : function(lang,type,location_id,number,callback){
        var q = "SELECT * FROM "+dbname+" WHERE ";
        var cond = [];
        if(type) cond.push("type = '"+type+"'");
        if(location_id) cond.push("locations_id = "+location_id);
        if(number) cond.push("number = '"+number+"'");
        mdlQuarter.getRows(q,callback);
    },

    getTypes : function(callback){
        var q = "SELECT DISTINCT type FROM "+dbname;
        mdlQuarter.getRows(q,callback);
    },
    
    addQuarter : function(location_id,type,number,callback){
        var q = "INSERT INTO "+dbname+" (type,locations_id,number) values('"+type+"',"+location_id+",'"+number+"')";
        db.query(q,function(err,res){
            if(err) callback(err);
            else callback(res.insertId);
        });
    }
}

module.exports = mdlQuarter;