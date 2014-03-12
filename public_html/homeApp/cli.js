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
homeUtil = require("./core/homeUtil");
var translate = require("./core/translate");

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
    var upload,rows = 0;
    switch (table){
        case 'quarter':
            upload = function(row,callback){
                model.quarter.addQuarter(row[0],row[1],row[2],function(added){
					if(util.isError(added) || !added.match(/\d+/))
						console.log("Added row, insertid = "+added);
					callback();
                });
            };
            break;
        case "allocate" :
            upload = function(row,callback){
                model.person.addPerson(row[3],row[4],row[5],"","","",function(personId){
                    if(!isNaN(personId)){
                        model.quarter.getQuarter(row[1],row[0],row[2],function(quarter){
                            if(quarter[0] && quarter[0].id){
                                model.allocate.allocate(quarter[0].id,personId,row[6],"",row[6],function(aloc){
                                    if(isNaN(aloc))
                                        console.log("Could not add allocation for row - "+row[9]);
                                    callback();
                                })
                            }else{
                                console.log("Quarter not found for row - "+row[9]);
                                callback()
                            }
                        })
                    }
                    else{
                        console.log("Person not added for row - "+row[9]);
                        callback()
                    }
                })
            }
    }

    var callback = function(){
        rows--;
        if(rows===0) process.exit();
    }
    csv().from.path(file, { delimiter: ',', escape: '"' })
    .on('record', function(row,index){
        rows++;
        upload(row,callback);
    });
};

exports.translatecsv = function(file){
    var outfile = file.replace(/(.*)\/([a-z_]+)\.csv/i,"$1/$2_hin.csv");
    var h = fs.createWriteStream(outfile);
    csv().from.path(file, { delimiter: ',', escape: '"' })
    .transform(function(row,index,callback){
        var comp = 0;
        row.forEach(function(r,i){
            translate.e2h(r,function(t){
                comp++;
                if(t) row[i] = t;
                else row[i] = r;
                if(comp===row.length){
                    console.log("completed " +comp+" of "+row.length +" in row "+index);
                    h.write(row.toString()+"\n");
                    callback();
                }
            });
        });
    }).on("error",function(err){
        console.log("Error: "+err.toString());
        process.exit();
    }).on("end",function(){
            h.end();
            process.exit();
    });
};


exports.maptransform = function(file,mapfile){
    var outfile = file.replace(/(.*)\/([a-z_]+)\.csv/i,"$1/$2_map.csv");
    fs.readFile(mapfile,function(err,data){
        var map = JSON.parse(data);
        var h = fs.createWriteStream(outfile);
        csv().from.path(file, { delimiter: ',', escape: '"' })
        .transform(function(row,index,callback){
            row.forEach(function(r,i){
                if(map[r])  row[i] = map[r];
            });
            h.write('"'+row.join('","')+'"\n');
            callback();
        }).on("error",function(err){
            console.log("Error: "+err.toString());
            process.exit();
        }).on("end",function(){
            console.log("CSV stream transformed: ");
            h.end(process.exit);
        });
    });
};


exports.regextransform = function(file,regfile){
    var outfile = file.replace(/(.*)\/([a-z_]+)\.csv/i,"$1/$2_map.csv");
    fs.readFile(regfile,function(err,data){
        var map = JSON.parse(data);
        fs.readFile(file,function(err,datain){
            var contents = datain.toString();
            map.forEach(function(key){
                var reg = new RegExp(key.reg,"ig");
                contents = contents.replace(reg,key.replace);
            })
            fs.writeFile(outfile,contents,process.exit);
        });
    });
};

exports.addRows = function(file){
    var outfile = file.replace(/(.*)\/([a-z_]+)\.csv/i,"$1/$2_rowfil.csv");
    fs.readFile(file,function(err,data){
        var out = "";
        var rows = 0,str="";
        var lines = data.toString().split("\n");
        console.log("found lines "+lines.length);
        lines.forEach(function(line){
            rows++;var fields = line.split(',');
            console.log("row count "+rows);
            var id = parseInt(fields[0]);
            if(!str)
                str = Array(fields.length).join(",");
            while(id>rows){
                out += rows+str+"\n";
                rows++;
            }
            out += line+"\n";
        });
        fs.writeFile(outfile,out,process.exit);
    });
}

if(process.argv.length<3){
    console.log("No action supplied,please choose an action from among - [upload|translate|maptransform|regextransform].");
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
	case 'translate' :
		if(process.argv.length<4){
            console.log("No enough arguments for translate, provide <inputfile>");
            process.exit();
        }
        exports.translatecsv(process.argv[3]);
        break;
    case 'maptransform' :
        if(process.argv.length<5){
            console.log("No enough arguments for maptransform, provide <inputfile>  <mapfile> ");
            process.exit();
        }
        exports.maptransform(process.argv[3],process.argv[4]);
        break;
    case 'regextransform' :
        if(process.argv.length<5){
            console.log("No enough arguments for regextransform, provide <inputfile>  <mapfile> ");
            process.exit();
        }
        exports.regextransform(process.argv[3],process.argv[4]);
        break;
    case 'addrows' :
        if(process.argv.length<4){
            console.log("No enough arguments for regextransform, provide <inputfile>");
            process.exit();
        }
        exports.addRows(process.argv[3]);
        break;
    default: console.log("please choose an action from among - [upload|translate|maptransform|regextransform|addrows].");
}