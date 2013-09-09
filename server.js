var express = require('express');
var app = express();
var _ = require('underscore');
var connect = require('connect');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var crypto = require('crypto')
  ,	key = "cute kitty cat";

var users = require('./public/controller/usersApi.js');
var usersMod = require('./public/model/userModel.js');

var mongoose = require('mongoose');

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//-----------------------------------PASSPORT------------------------

mongoose.connect('mongodb://localhost/catnap', function (err){
	if(err) {console.log(err);}
	else{console.log('connected to database: CATNAP')}
});

passport.use(new LocalStrategy(
	function (username, password, done){

		usersMod.findOne({'username':username, 'password':crypto.createHash('md5').update(password).digest('hex')}, function (err, doc){
			if(err){ return done(err); }
			if(!doc){return done(null, false, {messege:"username does not exist"});} 
			return done(null, doc);
		});
	}
));

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  usersMod.find({'username': username}, function (err, user) {
    done(err, user);
  });
});

//-----------------------------------PASSPORT-------------------------------


app.configure(function () {
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/public/views'); // __dirname = root folder.
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: "keyboard cat"}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});



app.get('/',function (req, res){//home
	res.render('index', {title:"Welcome to CATnap"});
});


app.post('/', function (req, res){
/*	mongoose.connect('mongodb://localhost/catnap', function (err){
		if(err) {console.log(err);}
		else{console.log('connected to database: CATNAP')}
	});*/
	new usersMod({
		username	: req.body.uname,
		password	: crypto.createHash('md5').update(req.body.pword).digest('hex'),
		firstName	: req.body.firstname,
		lastName	: req.body.lastname,
		email		: req.body.email,
		joined		: new Date()

	}).save(function (err, user){
		if(err){
			throw err;
			console.log(err);
		}else{
			console.log("saved!");
			req.login(user, function (err){
				if(err){ throw err;}
				res.redirect('/myblogs');
			});
		}

	});	
});



app.post('/authenticate', function (req, res, next){
	passport.authenticate('local', function (err, user, info){
		if(err){ return next(err);}
		if(!user) {return res.redirect('/');}
		req.logIn(user, function (err){
			if(err){ return next(err);}
			return res.redirect('/myblogs');
		});
	})(req, res, next);
});

//============================================POST=================================
app.post('/checkUser', users.checkUser);//check users if username is available

app.post('/blogSubmit', users.blogSubmit);

app.post('/userUpdate', users.userUpdate);//update user profile

app.post('/blogDelete', users.blogDelete);

app.post('/commentSubmit', users.commentSubmit);
//=================================================GET==============================
//Destroy Session
app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

//app.get('/home/:id', users.blogs);

app.get('/home/:id', ensureLoggedIn('/'), users.blogs);

app.get('/myblogs', ensureLoggedIn('/'), users.getProf);

app.get('/404', function (req, res){
	res.render('404', {title: "Page Not Available"});
});



app.listen(8030, function () {
	console.log('Application Running. Now listening to localhost:8030');
});