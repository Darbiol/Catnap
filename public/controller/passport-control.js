var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var Users = require('../model/userModel.js');

mongoose.connect('mongodb://localhost/catnap', function (err){
	if(err) {console.log(err);}
	else{console.log('connected to database: CATNAP')}
});

passport.use(new LocalStrategy(
	function (username, password, done){
		Users.findOne({'username':username, 'password':password}function (err, doc){
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
  User.findOne({'username': username}, function(err, user) {
    done(err, user);
  });
});