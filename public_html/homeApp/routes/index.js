
/*
 * GET home page.
 */

exports.index = function(req, res){
	var addnew = req.view.getHtml("form",{
		"action" : "/quarters/addnew",
		"title" : "Add a quarter",
		'formid' : 'addnewqaurter',
		'ajax' : true,
		"inputs" : [
            { 'type' : 'hidden' , 'value': "", 'id' : 'location_id'},
			{ 'type' : 'text' , 'label' : 'Type' , 'value': "", 'id' : 'type', 'required' : true, suggesturl: "/suggest/type"} ,
			{ 'type' : 'text' , 'label' : 'Location' , 'value': "", 'id' : 'location', 'required' : true, suggesturl: "/suggest/location"},
			{ 'type' : 'text' , 'label' : 'Number' , 'value' : '' , 'id' : 'number', 'required': true }
		],
		"submittext" : "Add new house info"
	});
	var allocate = req.view.getHtml("form",{
		"action" : "/quarter/allocate",
		"title" : "New allocation",
		'formid' : 'allocate',
		'ajax' : true,
		"inputs" : [
            { 'type' : 'text' , 'label' : 'Type' , 'value': "", 'id' : 'type', 'required' : true, suggesturl: "/suggest/type"} ,
            { 'type' : 'text' , 'label' : 'Location' , 'value': "", 'id' : 'location', 'required' : true, suggesturl: "/suggest/location"},
            { 'type' : 'select' , 'label' : 'Number' , 'value' : '' , 'id' : 'number',options: []},
            { 'type' : 'text' , 'label' : 'Person name' , 'value' : '' , 'id' : 'name', 'required': true, suggesturl: "/suggest/personname"},
            { 'type' : 'text' , 'label' : 'Person date of birth' , 'value' : '' , 'id' : 'dob', 'required': true},
            { 'type' : 'text' , 'label' : 'Person post' , 'value' : '' , 'id' : 'post', 'required': true, suggesturl: "/suggest/post"},
            { 'type' : 'text' , 'label' : 'Current office' , 'value' : '' , 'id' : 'office', 'required': true, suggesturl: "/suggest/office"},
            { 'type' : 'select' , 'label' : 'Gender' , 'value' : 'M' , 'id' : 'gender', options: [
                {id : "M" , "label" :"Male"},{id : "F" , "label" :"Female"}
            ]},
            { 'type' : 'email' , 'label' : 'Email' , 'value' : '' , 'id' : 'email'},
            { 'type' : 'text' , 'label' : 'Phone' , 'value' : '' , 'id' : 'phone'},
            { 'type' : 'date' , 'label' : 'Date from' , 'value' : '' , 'id' : 'datefrom'},
            { 'type' : 'date' , 'label' : 'Date till' , 'value' : '' , 'id' : 'dateto'}
		],
		"submittext" : "Allocate"
	});
	var tabs = [
		{id: "addnew" , label: "Add a new Quarter", content: addnew},
		{id: "allocate", label: "Allocate a quarter" , content: allocate}
	];
	res.send(200,req.view.getPage({
		title: "Quarters",
        content: req.view.getHtml("navTabs",{tabs: tabs})
	}));
};

exports.lang = function(req,res){
	req.session.lang = req.query.lang;
	res.json(200,{status: true});
}