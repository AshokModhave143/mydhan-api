const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bearerStrategy = require('passport-http-bearer').Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../../routes/auth/user.schema');
const Session = require('../../dbmodels/Sessions/sessionSchema');

passport.serializeUser((user, done) => {
	// console.log('serializeuser');
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	// console.log('deseriazeUser');
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

/**
 * Sign in using Email and Password.
 */
passport.use(
	new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { msg: `User ${username} not found.` });
			}

			user.comparePassword(password, (err, isMatch) => {
				if (err) {
					return done(err);
				}
				if (isMatch) {
					return done(null, user);
				}
				return done(null, false, { msg: 'Invalid username or password.' });
			});
		});
	})
);

//to do not working
passport.use(
	new bearerStrategy(function(token, done) {
		process.nextTick(function() {
			// var tokenData = [];
			// tokenData = token.split("*");
			Session.find({ _id: token }).then(
				function(docs, req, res) {
					if (docs.length > 0) {
						return done(null, docs[0]);
					} else {
						return done(null, false);
					}
				},
				null,
				function(errormsg, req, res) {
					console.log(errormsg);
					return done(errormsg);
				},
				this
			);
		});
	})
);
