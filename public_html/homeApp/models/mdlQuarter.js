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

var dbname = 'quarters';
var db = require("./db");
var mdlQuarter = {
    getRows : function(q,callback){
        db.query(q,function(err,rows){
            if(err) callback(err);
            else callback(rows);
            db.end(function(err){
                console.log("Error closing connection"+err.message);
            });
        });
    },

    getQuarter : function(lang,type,location,number,callback){
        var q = "SELECT * FROM "+dbname+" WHERE ";
        var cond = [];
        if(type)
            cond.push("type = '"+type+"'");
        if(location){
            var l = "location_"+(lang==='en'?"en":"hi");
            cond.push(l+" like '%"+location+"%'");
        }
        if(number)
            cond.push("number = '"+number+"'");
        mdlQuarter.getRows(q,callback);
    },
    
    getLocations : function(lang,callback){
        var l = "location_"+(lang==='en'?"en":"hi");
        var q = "SELECT DISTINCT "+l+" FROM "+dbname;
        mdlQuarter.getRows(q,callback);
    },
    
    
    getTypes : function(callback){
        var q = "SELECT DISTINCT type FROM "+dbname;
        mdlQuarter.getRows(q,callback);
    },
    
    addQuarter : function(location_en,location_hi,type,number,callback){
        var q = "INSERT INTO "+dbname+" (type,location_en,location_hi,number) values('"+type+"','"+location_en+"','"+location_hi+"','"+number+"')";
        db.query(q,function(err,res){
            if(err) callback(err);
            else callback(res.insertId);
            db.end(function(err){
                console.log("Error in closing connection"+err.message);
            });
        });
    }
}

module.exports = mdlQuarter;