/* ************************************************************* 
 * 
 * Date: Feb 10, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */
var con = require('mysql').createConnection({
    host     : 'localhost',
    database : 'mydb',
    user     : 'root',
    password : 'rewq12'
});
var db = {
    getRows : function(q,callback){
        con.query(q,function(err,rows){
            if(err) callback(err);
            else callback(rows);
        });
    },

    getRow : function(q,callback){
        con.query(q,function(err,rows){
            if(err) callback(err);
            else{
                if(rows.length && rows[0])
                    callback(rows[0]);
                else
                    callback(new Error("no rows"));
            }
        });
    },

    insert: function(q,callback){
        con.query(q,function(err,res){
            console.log("insert operation "+q);
            console.log(res);
            if(err) callback(err);
            else callback(res.insertId);
        });
    },

    update: function(q,callback){
        con.query(q,function(err,res){
            console.log("update operation "+q);
            console.log(res);
            if(err) callback(err);
            else callback(res);
        });
    },

    delete: function(q,callback){
        con.query(q,function(err,res){
            console.log("delete operation "+q);
            console.log(res);
            if(err) callback(err);
            else callback(res);
        });
    }
}
module.exports = db;