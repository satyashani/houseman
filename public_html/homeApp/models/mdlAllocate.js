/* * ************************************************************ 
 * 
 * Date: 6 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file mdlAllocate.js
 * 
 * 
 * *************************************************************** */


var util = require("util");
var db = require("./db");
var dbname = 'allocation';
var dbname_old = 'old_allocate';
var mdlAllocate = {
    deAllocate : function(qid,callback){
        var sql = "INSERT INTO "+dbname_old+" (SELECT * FROM "+dbname+" WHERE quarter_id = "+qid+");"
        var sql2 = "DELETE FROM " + dbname +" WHERE quarter_id = "+qid;
        db.insert(sql,function(res){
            if(util.isError(res)) callback(res);
            else{
                db.delete(sql2,callback);
            }
        });
    },

    getAllocations : function(qid,callback){
        var c = qid?" WHERE quarter_id  = " + qid:"";
        var sql = "SELECT * FROM "+ dbname + c;
        db.getRows(sql,callback);
    },

    updateValidity : function(qid,date,callback){
        var q = "UPDATE "+dbname+" SET date_valid = '"+date+"' WHERE quarter_id = "+qid;
        db.update(q,callback);
    },

    addPosDate : function(qid,date,callback){
        var d = date?new Date(date):new Date();
        var datefrom = [d.getFullYear(), d.getMonth()+1, d.getDate()].join("-");
        var q = "UPDATE "+dbname +" SET date_possess = "+datefrom+" WHERE quarter_id = "+qid;
        db.update(q,function(res){
            if(util.isError(res)) callback(res);
            else{
                var q2 = "UPDATE " + dbname_old + " SET date_vacate = " + date + " WHERE quarter_id = " + qid +" AND date_vacate IS NULL";
                db.update(q2,callback)
            }
        });
    },

    vacated : function(qid,date,callback){
        var d = date?new Date(date):new Date();
        var datefrom = [d.getFullYear(), d.getMonth()+1, d.getDate()].join("-");
        var q = "UPDATE "+dbname +" SET date_vacate = "+datefrom+" WHERE quarter_id = "+qid;
        db.update(q,callback);
    },

    allocate : function(qid,pid,from_date,upto_date,date_posses,callback){
        var d = from_date?new Date(from_date):new Date();
        var datefrom = [d.getFullYear(), d.getMonth()+1, d.getDate()].join("-");
        var d2 = upto_date?"'"+upto_date+"'":"NULL"
        var dpos = date_posses?"'"+date_posses+"'":"NULL"
        var q = "INSERT INTO "+dbname+" (date_order,date_valid,date_possess,quarter_id,person_id) values('"+datefrom+"',"+d2+","+dpos+","+qid+","+pid+")";
        mdlAllocate.getAllocations(qid,function(current){
            if(!current.length){
                db.insert(q,callback);
            }else{
                if(current[0].person_id == pid)
                    mdlAllocate.updateValidity(qid,upto_date,callback);
                else{
                    mdlAllocate.updateValidity(qid,datefrom,function(){
                        mdlAllocate.deAllocate(qid,function(result){
                            if(util.isError(result)) callback(result);
                            else db.insert(q,callback);
                        });
                    });
                }
            }
        })
    }
}

module.exports = mdlAllocate;