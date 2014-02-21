/* ************************************************************* 
 * 
 * Date: Feb 14, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */

var util = require('util');

exports.addNew = function(req,res){
    translate.e2h(req.body.location,function(loc){
        if(!loc)
            return res.send(200,req.view.getError("Quarter not added","Failed to translate english text."));
        model.quarter.addQuarter(loc,req.body.type.toUpperCase(),req.body.number,function(added){
            if(!isNaN(added))
                res.send(200,req.view.getSuccess("Quarter added","New quarter was added"));
            else
                res.send(200,req.view.getError("Quarter not added",added.message));
        });
    })
}

exports.addNewForm = function(req,res){
    var addnew = req.view.getHtml("form",{
        "action" : "/quarters/addnew",
        "title" : "Add a quarter",
        'formid' : 'addnewqaurter',
        'ajax' : true,
        "inputs" : [
            { 'type' : 'text' , 'label' : 'Type' , 'value': "", 'id' : 'type', 'required' : true, suggesturl: "/suggest/type"} ,
            { 'type' : 'text' , 'label' : 'Location' , 'value': "", 'id' : 'location', 'required' : true, suggesturl: "/suggest/location" , lang: "hi"},
            { 'type' : 'text' , 'label' : 'Number' , 'value' : '' , 'id' : 'number', 'required': true }
        ],
        "submittext" : "Add new house info"
    });
    res.send(200,req.view.getPage({
        title: "Quarters",
        content: addnew
    }));
}


exports.allocateForm = function(req,res){
    var allocate = req.view.getHtml("form",{
        "action" : "/quarters/allocate",
        "title" : "New allocation",
        'formid' : 'allocate',
        'ajax' : true,
        "inputs" : [
            { 'type' : 'hidden' , label: "", 'value' : '' , 'id' : 'person_id'},
            { 'type' : 'select' , 'label' : 'Type' , 'value': "A", 'id' : 'type', suggesturl: "/suggest/type", options: []} ,
            { 'type' : 'select' , 'label' : 'Location' , 'value': "", 'id' : 'location', suggesturl: "/suggest/location", options: []},
            { 'type' : 'select' , 'label' : 'Number' , 'value' : '' , 'id' : 'number',options: []},
            { 'type' : 'text' , 'label' : 'Person name' , 'value' : '' , 'id' : 'person', 'required': true , lang: "hi"},
            { 'type' : 'date' , 'label' : 'Date from' , 'value' : '' , 'id' : 'datefrom'},
            { 'type' : 'date' , 'label' : 'Date till' , 'value' : '' , 'id' : 'dateto'}
        ],
        "submittext" : "Allocate"
    });
    res.send(200,req.view.getPage({
        title: "Quarters",
        content: allocate
    }));
}

exports.allocate = function(req,res){
    if(!req.body.person_id)
        return res.send(200,req.view.getError("Could not allocate!","The person does not exist, please <a href='/person/addnew'><b>Add</b></a> his details first"))
    if(!req.body.number)
        return res.send(200,req.view.getError("Could not allocate!","No quarter was selected"));
    var datefrom = req.body.datefrom;
    var dateto = "";
    if(req.body.dateto){
        var d2 = new Date(req.body.dateto);
        var dateto = [d2.getFullYear(), d2.getMonth()+1, d2.getDate()].join("-");
    }
    model.allocate.allocate(req.body.number,req.body.person_id,datefrom,dateto,function(done){
        if(util.isError(done))
            res.send(200,req.view.getError("Could not allocate",done.message));
        else
            res.send(200,req.view.getSuccess("Allocated","Quater allocated to " +req.body.person));

    })

}

exports.routes = function(app){
    app.get('/quarters/addnew', exports.addNewForm);
    app.post('/quarters/addnew', exports.addNew);
    app.get('/quarters/allocate', exports.allocateForm);
    app.post('/quarters/allocate', exports.allocate);
    app.locals.sidebar.push({
        link: "#", label: "Quarters" , options: [
            {"link" : "/quarters/addnew", "label" : "Add new"},
            {"link" : "/quarters/allocate", "label" : "Allocate"}
        ]
    })
}