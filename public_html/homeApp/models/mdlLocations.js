/* * ************************************************************ 
 * 
 * Date: 14 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file mdlLocations.js
 * 
 * 
 * *************************************************************** */



var db = require("./db");
var dbname = 'locations';


var mdlLocations = {
    getRows : function(q,callback){
        db.query(q,function(err,rows){
            if(err) callback(err);
            else callback(rows);
        });
    },

    getLocId: function(lang,location,callback){
        var l = "location_"+(lang==='en'?"en":"hi");
        var q = "SELECT id FROM "+dbname+" WHERE "+l+" = '"+location+"'";
        mdlLocations.getRows(q,function(rows){
            if(rows && rows[0])
                callback(rows[0].id)
            else
                callback(false);
        });
    },

    getLocations : function(lang,location,callback){
		var l = "location_"+(lang==='en'?"en":"hi");
        var q = "SELECT id,"+l+" location FROM "+dbname+" WHERE "+l+" like '%"+location+"%'";
        mdlLocations.getRows(q,callback);
    },
			
    addLocation : function(location_en,location_hi,callback){
        var q = "INSERT INTO "+dbname+" (location_en,location_hi) values('"+location_en+"','"+location_hi+"')";
        db.query(q,function(err,res){
            if(err) callback(err);
            else callback(res.insertId);
        });
    }
}

module.exports = mdlLocations;