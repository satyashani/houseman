/* * ************************************************************ 
 * 
 * Date: 13 Feb, 2014
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file suggest.js
 * 
 * 
 * *************************************************************** */

exports.type = function(req,res){
    model.quarter.getTypes(function(rows){
        var out = {
            query: req.query.query,
            suggestions: []
        };
        rows.forEach(function(r){
            out.suggestions.push({data : r.type, value: r.type});
        })
        res.json(out);
    })
};

exports.location = function(req,res){
    var q = req.query.query?req.query.query:"";
    translate.e2h(q,function(loc){
        model.quarter.getLocations(loc,function(rows){
            var out = {
                query: req.query.query,
                suggestions: []
            };
            if(!rows.length)
                out.suggestions.push({data : loc, value: loc});
            else
                rows.forEach(function(r){
                    out.suggestions.push({data : r.location, value: r.location});
                });
            res.json(out);
        });
    });
};

exports.number = function(req,res){
    var q = req.query.query?req.query.query:"";
    model.quarter.getQuarter(req.query.type,req.query.location,q,function(rows){
        var out = {
            query: q,
            suggestions: []
        };
        rows.forEach(function(r){
            out.suggestions.push({data : r.id, value: r.number});
        })
        res.json(out);
    })
};

exports.personName = function(req,res){
    var q = req.query.query?req.query.query:"";
    translate.e2h(q,function(loc){
        model.person.getNames(loc,function(rows){
            var out = {
                query: q,
                suggestions: []
            };
            if(!rows.length)
                out.suggestions.push({data : 0, value: loc});
            else
                rows.forEach(function(r){
                    out.suggestions.push({data : r.id, value: r.name});
                })
            res.json(out);
        })
    });
};

exports.posts = function(req,res){
    var q = req.query.query?req.query.query:"";
    translate.e2h(q,function(loc){
        model.person.getPosts(loc,function(rows){
            var out = {
                query: q,
                suggestions: []
            };
            if(!rows.length)
                out.suggestions.push({data : 0, value: loc});
            else
                rows.forEach(function(r){
                    out.suggestions.push({data : r.id, value: r.post});
                })
            res.json(out);
        })
    });
};


exports.offices = function(req,res){
    var q = req.query.query?req.query.query:"";
    translate.e2h(q,function(loc){
        model.person.getOffices(loc,function(rows){
            var out = {
                query: q,
                suggestions: []
            };
            if(!rows.length)
                out.suggestions.push({data : 0, value: loc});
            else
                rows.forEach(function(r){
                    out.suggestions.push({data : r.id, value: r.office});
                })
            res.json(out);
        })
    });
};

/**
 *
 * @param {express} app
 */
exports.routes = function(app){
    app.get('/suggest/type', exports.type);
    app.get('/suggest/location', exports.location);
    app.get('/suggest/number', exports.number);
    app.get('/suggest/personname', exports.personName);
    app.get('/suggest/posts', exports.posts);
    app.get('/suggest/offices', exports.offices);
}