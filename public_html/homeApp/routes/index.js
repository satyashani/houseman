
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.redirect("/quarters/addnew");
};

exports.lang = function(req,res){
	req.session.lang = req.query.lang;
	res.json(200,{status: true});
}

exports.routes = function(app){
    app.get('/', exports.index);
    app.get('/setLang', exports.lang);
}