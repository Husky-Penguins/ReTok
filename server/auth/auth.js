var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../db/db').User;
var session = require('express-session');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');


passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('what is username and password??', username, password);
	// search username and password for comparison
		User.findAll({where: {username: username}})
		.then(function(user) {
			if (user.length === 0) {return done(null, false, {message: 'wrong username'});}
			if (!comparePw(password, user[0].password)) {return done(null, false, {message: 'wrong message'});}
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
	User.findAll({where: {id: id}})
	.then(function(user) {
		done(null, user);
	})
	.catch(function(err){
		done(err, null);
	})
});

var comparePw = function (pw, hash) {
	return bcrypt.compareSync(pw, hash);
};

var hashPw = function (pw, done) {
	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			done(err, null);
		} else {
			bcrypt.hash(pw, salt, function (err, hash) {
				if (err) {
					done(err, null);
				} else {
					done(null, hash);
				}
			});
		}
	});
};

module.exports.hashPwAsync = Promise.promisify(hashPw);
