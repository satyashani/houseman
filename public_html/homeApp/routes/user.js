
/*
 * GET users listing.
 */

exports.login = function(req, res){
    if(req.body.username && req.body.password){
        model.user.validate(req.body.username, req.body.password, function(user){
            if(user.id && user.name){
                req.session.user = user;
                res.send(200,req.view.getJsRedirect("/"));
            }else{
                res.send(401,req.view.getError("Username of password is invalid."));
            }
        })
    }else{
        var form = {
            "action" : "/user/login",
            "title" : "Login",
            'formid' : 'login',
            'ajax' : true,
            "inputs" : [
                { 'type' : 'text' , 'label' : 'Username' , 'value' : '' , 'id' : 'username', 'required': true},
                { 'type' : 'password' , 'label' : 'Password' , 'value' : '' , 'id' : 'password', 'required': true}
            ],
            "submittext" : "Login"
        };
        res.send(200,req.view.getPage({
            title: "Login Page",
            content: req.view.getHtml("form",form)
        }));
    }
};

exports.create = function(req,res){
    if(req.body.username && req.body.password && req.body.role){
        model.user.create(req.body.username,req.body.password,req.body.name,req.body.role,function(id){
           if(!isNaN(id)){
               res.send(200,req.view.getSuccess("User Added","User was added."));
           }else{
               res.send(200,req.view.getError("User not Added",id.message?id.message:"User was added."));
           }
        });
    }else{
        var form = {
            "action" : "/user/create",
            "title" : "New User",
            'formid' : 'newuser',
            'ajax' : true,
            "inputs" : [
                { 'type' : 'text' , 'label' : 'Username' , 'value' : '' , 'id' : 'username', 'required': true},
                { 'type' : 'text' , 'label' : 'Password' , 'value' : '' , 'id' : 'password', 'required': true},
                { 'type' : 'text' , 'label' : 'Full name' , 'value' : '' , 'id' : 'name', 'required': true},
                { 'type' : 'select' , 'label' : 'Role' , 'value' : '3' , 'id' : 'role',options: [
                    {label: 'Admin' , value: '1'},
                    {label: 'Editor' , value: '2'},
                    {label: 'Allotter' , value: '3', selected: true},
                    {label: 'Viewer' , value: '4'}
                ]}
            ],
            "submittext" : "Allocate"
        };
        res.send(200,req.view.getPage({
            title: "Quarters",
            content: req.view.getHtml("form",form)
        }));
    }
}

exports.logout = function(req,res){
    if(req.session)
        req.session.destroy();
    res.redirect("/");
}

exports.routes = function(app){
    app.all("/user/login",exports.login);
    app.all("/user/create",accessCheck('1'),exports.create);
    app.get("/user/logout",exports.logout);
    app.locals.sidebar.push({link: "/user/create", label: "New User", roles:  "1"});
}
