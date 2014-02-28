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
        })
    })
};

exports.quartersList = function(req,res){
    var t = req.body.type && req.body.type != 'all' ? req.body.type : "";
    var l = req.body.location && req.body.location != 'all' ? req.body.location : "";
    var s = req.body.status && req.body.status != 'all' ? req.body.status : "";
    var q = req.body.term;
    model.quarter.search(t,l,s,q,function(rows){
        var allocLink = "/quarter/allocate"
        for(var r=0;r<rows.length;r++){
            var dv = new Date(rows[r].date_valid);
            rows[r].date_valid =  dv.getTime()?dv.toDateString():"";
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
            }
        }
        var result = {
            labels: ['Type','Location','Number','Name','Office','Post','Valid Upto'],
            keys: ['type','location','number','name','office','post','date_valid'],
            rows: rows
        }
        res.send(200,req.view.getHtml("list",{result: result}));
    });
}

exports.routes = function(app){
    app.get('/list/quarters', exports.quartersForm);
    app.post('/list/quarters', exports.quartersList);
    app.locals.sidebar.push( {"link" : "/list/quarters", "label" : "Quarter Lists"});
}