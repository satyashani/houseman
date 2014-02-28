/* ************************************************************* 
 * 
 * Date: Feb 16, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */

exports.addNew = function(req,res){
    translate.e2h(req.body.name,function(name){
        translate.e2h(req.body.post,function(post){
            translate.e2h(req.body.office,function(office){
                if(!name || !post || !office)
                    return res.send(200,req.view.getError("Person not added","Failed to translate text."));
                model.person.addPerson(name,post,office,req.body.gender,req.body.email,req.body.phone,function(added){
                    if(!isNaN(added))
                        res.send(200,req.view.getSuccess("Person added","New person was added"));
                    else
                        res.send(200,req.view.getError("Person not added",added.message));
                });
            })
        })
    })
}


exports.addNewForm = function(req,res){
    var allocate = req.view.getHtml("form",{
        "action" : "/person/addnew",
        "title" : "New person",
        'formid' : 'newperson',
        'ajax' : true,
        "inputs" : [
            { 'type' : 'text' , 'label' : 'Person name' , 'value' : '' , 'id' : 'name', 'required': true, suggesturl: "/suggest/personname" , lang: "hi"},
            { 'type' : 'text' , 'label' : 'Person post' , 'value' : '' , 'id' : 'post', 'required': true, suggesturl: "/suggest/posts" , lang: "hi"},
            { 'type' : 'text' , 'label' : 'Current office' , 'value' : '' , 'id' : 'office', 'required': true, suggesturl: "/suggest/offices" , lang: "hi"},
            { 'type' : 'select' , 'label' : 'Gender' , 'value' : 'M' , 'id' : 'gender', options: [
                {value : "M" , "label" :"Male"},{value : "F" , "label" :"Female"}
            ]},
            { 'type' : 'email' , 'label' : 'Email' , 'value' : '' , 'id' : 'email'},
            { 'type' : 'text' , 'label' : 'Phone' , 'value' : '' , 'id' : 'phone'}
        ],
        "submittext" : "Add"
    });
    res.send(200,req.view.getPage({
        title: "New Person Details",
        content: allocate
    }));
}

exports.personSelect = function(req,res){
    var q = req.query.query?req.query.query:"";
    translate.e2h(q,function(loc){
        model.person.getPersons(loc,"","",function(rows){
            var out = {
                query: q,
                suggestions: []
            };
            rows.forEach(function(r){
                out.suggestions.push({data : r.id, value: r.name+ " , "+ r.post+ " ("+ r.office+")"});
            });
            res.json(out);
        })
    });
}

exports.routes = function(app){
    app.get('/person/addnew',accessCheck('12'), exports.addNewForm);
    app.post('/person/addnew',accessCheck('12'), exports.addNew);
    app.get('/person/selectlist', exports.personSelect);
    app.locals.sidebar.push({
        link: "#", label: "Person" , roles: "123", options: [
            {"link" : "/person/addnew", "label" : "Add new", roles:  "123"}
//            ,{"link" : "/person/edit", "label" : "Edit", roles:  "123"}
        ]
    });
}