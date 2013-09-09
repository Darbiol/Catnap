var mongoose = require('mongoose');
var crypto = require('crypto')
  ,	key = "cute kitty cat";
var mongodb = require('mongodb');
 var _ = require('underscore');

var Users = require('../model/userModel.js');
var Blogs = require('../model/blogModel.js');
var now = new Date();
var dateFormat = require('dateformat');

exports.getProf = function(req, res){
//	mongoose.connect('mongodb://localhost/catnap', function (err){
//	if(err) {console.log(err);}
//	else{console.log('connected to database: CATNAP')}

	Users.find({username: req.user[0].username}, function (err, info){
		if(err){
			throw err;
			console.log(err);
		}else{
			
			Blogs.find({user: req.user[0].username}, function (err, doc){
				if(err){
					throw err;
					console.log(err);
				}else{
					res.render( 'myblogs', {title:'Welcome to CATnap',	infos: info, doc: doc});

					
				}
			});
			
		}
	});
//});
}

exports.blogSubmit = function(req, res){

	new Blogs({
				user	: req.user[0].username,
			 	title	: req.body.title,
			 	entry	: req.body.entry,
			 	added	: new Date(),
			 	comments :[]
			}).save(function (err, doc){
				if(err){throw err; console.log(err)}
				else{
					console.log("blog Saved!");
					res.redirect('/myblogs');
				}
			});

}

exports.blogs = function (req, res){
	var id = req.params.id;
	var  user = req.user[0].username;
	if(id=="0"){

	Blogs.findOne({},{}, {sort:{added:-1}}, function (err, blogDoc){
			if(err){ throw err; console.log(err);res.redirect('/404');}
			else{
				Blogs.find({_id:{$ne:blogDoc._id}}, {_id:1, title:1}, {limit:5}, function (err, link){
					if(err){ throw err; console.log(err);res.redirect('/404');}
					res.render('home', {title: "Welcometo CATnap", blog:blogDoc, links:link, user:user});
				});

			}
		});

	}else{
		Blogs.findOne({_id:id}, function (err, doc){
			if(err){ console.log(err); res.redirect('/404')}
			else{
				//console.log(doc.comments)
				Blogs.find({_id: {$ne:id}}, {_id:1, title:1, added:1}, function (err, link){
					if(err){throw err;console.log(err);}
					else{
						res.render('home', {title: "Welcometo CATnap", blog:doc, links:link, user:user});
					}
				}).sort({added:-1}).limit(6);
			}
		});
			//console.log('ObjectId("'+id+'")');
	}
}

exports.checkUser = function (req, res){

	var user = req.body.uname;
	console.log(user);
	Users.findOne({username: user}, function (err, doc){

		if(err){throw err; console.log(err);}
		else{
			console.log(doc)
			if(doc){console.log(1);res.json({result:1});}// already exist
			else{console.log(0);res.json({result:0});}//username available
		}
	});
}

exports.userUpdate = function(req, res){
	var field = req.body.field;
	var update = req.body.update;
	var user = req.user[0].username;
	var query = '{'+field+':"'+update+'"}';


	if(req.body.field=="password"){
		var pass = crypto.createHash('md5').update(update).digest('hex');
		Users.update({username:user},{$set:{'password':pass}}, function (err, count){
			if(err){throw err; return err;}
			Users.findOne({username:user}, function (err, doc){
				if(err){throw err; return err;}
				console.log(doc);
				res.send("done");
			});
		});

	}else if(req.body.field=="firstname"){
		Users.update({username:user},{$set:{'firstName':update}}, function (err, count){
			if(err){throw err; return err;}
			Users.findOne({username:user}, function (err, doc){
				if(err){throw err; return err;}
				console.log(doc);
				res.send("done");
			});
		});

	}else if(req.body.field=="lastname"){
		Users.update({username:user},{$set:{'lastName': update}}, function (err, count){
			if(err){throw err; return err;}
			Users.findOne({username:user}, function (err, doc){
				if(err){throw err; return err;}
				console.log(doc);
				res.send("done");
			});
		});

	}else if(req.body.field == "email"){
		Users.update({username:user},{$set:{'email': update}}, function (err, count){
			if(err){throw err; return err;}
			Users.findOne({username:user}, function (err, doc){
				if(err){throw err; return err;}
				console.log(doc);
				res.send("done");
			});
		});

	}
	res.send("done");
}

exports.commentSubmit = function (req, res){
	Blogs.find({id:req.body.blogId}, function (err, doc){
		console.log(doc);
	});
	Blogs.update({_id:req.body.blogId}, {$addToSet:{comments:{username:req.user[0].username, body:req.body.comment, dateComment:now}}}, function (err, count){
		if(err){throw err; console.log(err);}
		res.redirect('/home/'+req.body.blogId);
	});
}

exports.blogDelete = function (req, res){
	Blogs.remove({_id:req.body.blogId}, function (err){
		if(err){throw err; console.log(err);}
		console.log("delete successful")
		res.send("done");
	});

}