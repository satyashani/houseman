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
    var sendhtml = function(formdata){
        var allocate = req.view.getHtml("form",formdata);
        if(req.xhr){
            res.send(200,allocate);
        }else{
            res.send(200,req.view.getPage({
                title: "Quarters",
                content: allocate
            }));
        }
    };
    var formdata = {
        "action" : "/quarters/allocate",
        "title" : "New allocation",
        'formid' : 'allocate',
        'ajax' : true,
        "inputs" : [
            { 'type' : 'hidden' , label: "", 'value' : '' , 'id' : 'person_id'},
            { 'type' : 'text' , 'label' : 'Person name' , 'value' : '' , 'id' : 'person', 'required': true , lang: "hi"},
            { 'type' : 'date' , 'label' : 'Date from' , 'value' : '' , 'id' : 'datefrom' , required: true},
            { 'type' : 'date' , 'label' : 'Date till' , 'value' : '' , 'id' : 'dateto'},
            { 'type' : 'date' , 'label' : 'Possession Date' , 'value' : '' , 'id' : 'datepossess'}
        ],
        "submittext" : "Allocate"
    };
    if(req.query.quarterid){
        formdata.inputs.push({ 'type' : 'hidden' , 'value' : req.query.quarterid , 'id' : 'number'});
        model.quarter.getById(req.query.quarterid,function(row){
            if(!row.number) return res.send(500,req.view.getError("Error","Invalid quarter Id"));
            formdata.inputs.unshift({ 'type' : 'header' , label: row.type+" - "+row.number +" ," + row.location});
            sendhtml(formdata);
        })
    }else{
        formdata.inputs.push({ 'type' : 'select' , 'label' : 'Type' , 'value': "A", 'id' : 'type', suggesturl: "/suggest/type", options: []});
        formdata.inputs.push({ 'type' : 'select' , 'label' : 'Location' , 'value': "", 'id' : 'location', suggesturl: "/suggest/location", options: []});
        formdata.inputs.push({ 'type' : 'select' , 'label' : 'Number' , 'value' : '' , 'id' : 'number',options: []});
        sendhtml(formdata);
    }
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
        dateto = [d2.getFullYear(), d2.getMonth()+1, d2.getDate()].join("-");
    }
    var datepos = "";
    if(req.body.datepossess){
        var d2 = new Date(req.body.datepossess);
        datepos = [d2.getFullYear(), d2.getMonth()+1, d2.getDate()].join("-");
    }

    model.allocate.allocate(req.body.number,req.body.person_id,datefrom,dateto,datepos,function(done){
        if(util.isError(done))
            res.send(200,req.view.getError("Could not allocate",done.message));
        else
            res.send(200,req.view.getSuccess("Allocated","Quater allocated to " +req.body.person));

    });
};

exports.deallocate = function(req,res){
    if(!req.query.quarterid)
        return res.send(200,req.view.getError("Error!","No quarter was selected"));
    if(!req.query.deallocateconfirm){
        model.quarter.getById(req.query.quarterid,function(q){
            res.send(200,req.view.getHtml("confirm",{
                "title" : "Cancel allottment",
                "yesurl" :'/quarters/deallocate?deallocateconfirm=yes&quarterid='+req.query.quarterid,
                "nourl" : "#",
                "action" : "Are you sure you want to cancel the allottment of <b>"+ q.type+","+ q.number+" in "+ q.location+"</b>"
            }));
        });
    }else{
        model.allocate.deAllocate(req.query.quarterid,function(done){
            if(util.isError(done))
                res.send(200,req.view.getError("Error",done.message));
            else
                res.send(200,req.view.getSuccess("De-Allocated","Quater allotment cancelled."));
        });
    }
};

exports.addPosDate = function(req,res){
    if(!req.query.quarterid)
        return res.send(200,req.view.getError("Error!","No quarter was selected"));
    if(!req.body.datepossess){
        var d = new Date();
        var date = [d.getFullYear(), d.getMonth()+1, d.getDate()].join("-");
        model.quarter.getById(req.query.quarterid,function(q){
            res.send(200,req.view.getHtml("form",{
                "action" : "/quarters/addposdate?quarterid="+req.query.quarterid,
                "title" : "Add Date of Possession for "+ q.number,
                'formid' : 'addposdate',
                'ajax' : true,
                "inputs" : [
                    { 'type' : 'date' , 'label' : 'Possession Date' , 'value' : date , 'id' : 'datepossess',required:true}
                ],
                "submittext" : "Save"
            }));
        });
    }else{
        model.allocate.addPosDate(req.query.quarterid,req.body.datepossess,function(done){
            if(util.isError(done))
                res.send(200,req.view.getError("Error",done.message));
            else
                res.send(200,req.view.getSuccess("Cheers :-)","Date of possession added."));
        });
    }
}

exports.vacated = function(req,res){
    if(!req.query.quarterid)
        return res.send(200,req.view.getError("Error!","No quarter was selected"));
    if(!req.body.datevacate){
        var d = new Date();
        var date = [d.getFullYear(), d.getMonth()+1, d.getDate()].join("-");
        model.quarter.getById(req.query.quarterid,function(q){
            res.send(200,req.view.getHtml("form",{
                "action" : "/quarters/vacated?quarterid="+req.query.quarterid,
                "title" : "Quarter Vacated - "+ q.number,
                'formid' : 'addposdate',
                'ajax' : true,
                "inputs" : [
                    { 'type' : 'date' , 'label' : 'Date of Vacation' , 'value' : date , 'id' : 'datevacate',required:true}
                ],
                "submittext" : "Save"
            }));
        });
    }else{
        model.allocate.vacated(req.query.quarterid,req.body.datevacate,function(done){
            if(util.isError(done))
                res.send(200,req.view.getError("Error",done.message));
            else
                res.send(200,req.view.getSuccess("Cheers :-)","Quarter was marked as vacated."));
        });
    }
}

exports.routes = function(app){
    app.get('/quarters/addnew',accessCheck('12'), exports.addNewForm);
    app.post('/quarters/addnew',accessCheck('123'), exports.addNew);
    app.get('/quarters/allocate',accessCheck('123'), exports.allocateForm);
    app.post('/quarters/allocate',accessCheck('123'), exports.allocate);
    app.get('/quarters/deallocate',accessCheck('12'), exports.deallocate);
    app.all('/quarters/addposdate',accessCheck('12'), exports.addPosDate);
    app.all('/quarters/vacated',accessCheck('12'), exports.vacated);
    app.locals.sidebar.push({
        link: "#", label: "Quarters", roles:  "123" , options: [
            {"link" : "/quarters/addnew", "label" : "Add new", roles:  "12"},
            {"link" : "/quarters/allocate", "label" : "Allocate", roles:  "123"}
        ]
    })
}