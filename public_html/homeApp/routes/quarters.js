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
exports.addNew = function(req,res){
    model.locations.getLocId(req.body.location.lang(),req.body.location,function(location_id){
        if(location_id == false){
            var lang = req.body.location.lang();
            translate.t(req.body.location,function(loc_tr){
                var loc_hi = "",loc_en = "";
                if(lang=="en"){
                    loc_en = req.body.location; loc_hi = loc_tr;
                }else{
                    loc_hi = req.body.location; loc_en = loc_tr;
                }
                console.log(loc_en+","+loc_hi+","+location_id)
                model.locations.addLocation(loc_en.toLowerCase(),loc_hi,function(loc_id){
                    if(!isNaN(loc_id)){
                        model.quarter.addQuarter(loc_id,req.body.type.toUpperCase(),req.body.number,function(added){
                            if(!isNaN(added))
                                res.send(200,req.view.getSuccess("Quarter added","New quarter was added"));
                            else
                                res.send(200,req.view.getError("Quarter not added",added.message));
                        });
                    }
                    else{
                        console.log(JSON.stringify(id));
                        res.send(200,req.view.getError("Quarter not added",id.message));
                    }
                })
            })
        }else{
            model.quarter.addQuarter(location_id,req.body.type.toUpperCase(),req.body.number,function(added){
                if(!isNaN(added))
                    res.send(200,req.view.getSuccess("Quarter added","New quarter was added"));
                else
                    res.send(200,req.view.getError("Quarter not added",added.message));
            });
        }
    });
}