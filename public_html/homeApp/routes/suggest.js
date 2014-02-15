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
    model.locations.getLocations(req.query.query.lang(),req.query.query,function(rows){
        var out = {
            query: req.query.query,
            suggestions: []
        };
        rows.forEach(function(r){
            out.suggestions.push({data : r.id, value: r.location});
        });
        res.json(out);
    });
};

exports.number = function(req,res){
    model.quarter.getQuarter(req.query.query.lang(),req.query.type,req.query.location_id,"",function(rows){
        var out = {
            query: req.query.query,
            suggestions: []
        };
        rows.forEach(function(r){
            out.suggestions.push({data : r.number, value: r.number});
        })
        res.json(out);
    })
};