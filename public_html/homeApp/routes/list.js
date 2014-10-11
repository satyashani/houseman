/* ************************************************************* 
 * 
 * Date: Feb 23, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */
var allFields = {
    type : "Type",
    location : "Location",
    number : "Number",
    name : "Name",
    office : "Office",
    post : "Post",
    phone : "Contact",
    date_order : "Alloted on",
    date_valid : "Valid Upto"
};  
    
exports.quartersForm = function(req,res){
    model.quarter.getLocations("",function(locrows){
        model.quarter.getTypes(function(typerows){
            var locs  = [{label: 'All', value: 'all', selected: true}];
            locrows.forEach(function(r){
                locs.push({label : r.location, value: r.location});
            });
            var types  = [{label: 'All', value: 'all', selected: true}];
            typerows.forEach(function(r){
                types.push({label : r.type, value: r.type});
            });
            var status = [
                {'label' : "All", value: "all"},
                {'label' : "Allotted", value: "allotted"},
                {'label' : "Not allotted", value: "unallotted",selected: true},
                {'label' : "Vacant", value: "vacant"},
                {'label' : "Illegal", value: "illegal"}
            ];
            var form = req.view.getHtml("houseList",{
                formid: "listquarters", action : "/list/quarters",
                types : types,
                locations: locs,
                status: status,
                statusSelected: "unallotted"
            });
            res.send(200,req.view.getPage({
                title : "Quarter lists",
                content : form
            }));
        });
    });
};

var editListFields = function(req,res){
    if(!req.session.listFields){
        req.session.listFields = {
            type : "Type",
            location : "Location",
            number : "Number",
            name : "Name",
            office : "Office",
            post : "Post",
            phone : "Contact",
            date_order : "Alloted on",
            date_valid : "Valid Upto"
        };
    }
    var inputs = [];
    for(var i in allFields)
       inputs.push({ 'type' : 'checkbox' , 'label' : allFields[i] , 'value' : req.session.listFields.hasOwnProperty(i) , 'id' : i});
    var form = req.view.getHtml("form",{
        "action" : "/list/editFields",
        "title" : "Select list fields",
        'formid' : 'listfields',
        'ajax' : false,
        "inputs" : inputs,
        "submittext" : "Save"
    });
    res.send(200,form);
};

var saveListFields = function(req,res){
    req.session.listFields = {};
    console.log(JSON.stringify(req.body));
    for(var i in req.body)
        if(allFields.hasOwnProperty(i)) req.session.listFields[i] =  allFields[i];
    res.redirect("/list/quarters");
};

exports.quartersList = function(req,res){
    var t = req.body.type && req.body.type != 'all' ? req.body.type : (req.query.type && req.query.type != "all"?req.query.type:"");
    var l = req.body.location && req.body.location != 'all' ? req.body.location :  (req.query.location && req.query.location != "all"?req.query.location:"");
    var s = req.body.status && req.body.status != 'all' ? req.body.status :  (req.query.status && req.query.status != "all"?req.query.status:"");
    var perpage = 100, startIndex = (req.query.start?parseInt(req.query.start):1), start = (startIndex-1)*perpage;
    var q = req.body.term;
    if(!req.session.listFields)
        req.session.listFields = allFields;
    var fields = Object.keys(req.session.listFields),fieldNames = [];
    for(var i in req.session.listFields) fieldNames.push(req.session.listFields[i]);
    model.quarter.search(t,l,s,q,start,perpage,function(rows){
        model.quarter.rowcount(function(totalrows){
            for(var r=0;r<rows.length;r++){
                var dv = new Date(rows[r].date_valid);
                rows[r].date_valid =  dv.getTime()?dv.toDateString():"";
                if(rows[r].status == 'allotted' && rows[r].date_order){
                    var dto = new Date(rows[r].date_order);
                    rows[r].date_order =  dto.getTime()?dto.toDateString():"";
                }
                rows[r].actions = [];
                if(req.session.user && (req.session.user.role==1 || req.session.user.role == 2)){
                    if(rows[r].status == 'unallotted' || rows[r].status == 'vacant')
                        rows[r].actions.push({'label': "Allot", 'url' : "/quarters/allocate?quarterid="+rows[r].id});
                    if(rows[r].status == 'allotted'){
                        rows[r].actions.push({'label': "Cancel", 'url' : "/quarters/deallocate?quarterid="+rows[r].id});
                        if(!rows[r]['date_vacate'])
                            rows[r].actions.push({'label': "Vacated", 'url' : "/quarters/vacated?quarterid="+rows[r].id});
                        if(!rows[r]['date_possess'])
                            rows[r].actions.push({'label': "Add Possession Date", 'url' : "/quarters/addpostdate?quarterid="+rows[r].id});
                    }
                    if(rows[r].personid) rows[r].name = {'label': rows[r].name, 'url' : "/person/edit/"+rows[r].personid};
                }
            }
            var result = {
                labels: fieldNames,
                keys: fields,
                rows: rows
            };
            if(totalrows>perpage){
                var pagingHtml = req.view.getHtml("pagination",{
                    "link" : "/list/quarters?type="+t+"&location="+l+"&status="+s+"&term="+q,
                    "pagecount" : Math.ceil(totalrows/perpage),
                    "pagevar" : "start",
                    "activei" : startIndex,
                    "pagingid" : "listquarters"
                });
                result.paging = pagingHtml;
            }
            res.send(200,req.view.getHtml("list",{result: result}));
        });
    });
}

exports.routes = function(app){
    app.get('/list/quarters', exports.quartersForm);
    app.post('/list/quarters', exports.quartersList);
    app.get('/list/editFields', editListFields);
    app.post('/list/editFields', saveListFields);
    app.locals.sidebar.push( {"link" : "/list/quarters", "label" : "Quarter Lists"});
}