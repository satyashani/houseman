/* ************************************************************* 
 * 
 * Date: Mar 04, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */

var fs = require('fs');
var csv = require("csv");
var homeUtil = require("./core/homeUtil");
var model = {
    /**
     *
     * @type mdlUser
     */
    user: require("./models/mdlUser"),
    /**
     *
     * @type mdlQuarter
     */
    quarter: require("./models/mdlQuarter"),
    /**
     *
     * @type mdlPerson
     */
    person: require("./models/mdlPersons"),
    /**
     *
     * @type mdlAllocate
     */
    allocate: require("./models/mdlAllocate")
};
var translate = require("./core/translate");


exports.upload = function(file,table){
    var upload;
    switch (table){
        case 'quarter':
            upload = function(row){
                model.quarter.addQuarter(row[0],row[1],row[2],function(added){
                    console.log("Added row, insertid = "+added);
                });
            };
            break;
    }
    csv().from.path(file, { delimiter: ',', escape: '"' })
    .on('record', function(row,index){
        upload(row);
    });
};

if(process.argv.length<3){
    console.log("No action supplied");
    process.exit();
}
switch(process.argv[2]){
    case 'upload' :
        if(process.argv.length<5){
            console.log("No enough arguments for upload, provide <uploadfile> <tablename> ");
            process.exit();
        }
        exports.upload(process.argv[3],process.argv[4]);
        break;
    default: console.log("please choose an action from among - [upload].");
}