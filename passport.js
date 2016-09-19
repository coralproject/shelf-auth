const passport = require('passport');
const User = require('./models/user');

//==============================================================================
// SESSION SERIALIZATION
//==============================================================================

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    id: id
  }, (err, user) => {
    if (err) {
      return done(err);
    }

    return done(null, user);
  });
});

/**
 * Validates that a user is allowed to login.
 * @param {User}     user the user to be validated
 * @param {Function} done the callback for the validation
 */
function ValidateUserLogin(user, done) {
  if (!user) {
    return done(new Error('user not found'));
  }

  if (user.disabled) {
    return done(new Error('user disabled'));
  }

  return done(null, user);
}

//==============================================================================
// STRATEGIES
//==============================================================================

// LOCAL

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User.findLocalUser(email, password, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {message: 'Incorrect email/password combination'});
    }

    return ValidateUserLogin(user, done);
  });
}));

// FACEBOOK

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.ROOT_URL}/connect/facebook/callback`
  }, (accessToken, refreshToken, profile, done) => {
    User.findOrCreateExternalUser(profile, (err, user) => {
      if (err) {
        return done(err);
      }

      return ValidateUserLogin(user, done);
    });
  }
));

// TWITTER

const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.ROOT_URL}/connect/twitter/callback`
  }, (token, tokenSecret, profile, done) => {
    User.findOrCreateExternalUser(profile, (err, user) => {
      if (err) {
        return done(err);
      }

      return ValidateUserLogin(user, done);
    });
  }
));

// GOOGLE

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.ROOT_URL}/connect/google/callback`
  }, (accessToken, refreshToken, profile, done) => {
    User.findOrCreateExternalUser(profile, (err, user) => {
      if (err) {
        return done(err);
      }

      return ValidateUserLogin(user, done);
    });
  }
));

module.exports = passport;
