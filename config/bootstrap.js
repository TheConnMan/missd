var passport = require('passport'),
  GitHubStrategy = require('passport-github2').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  TwitterStrategy = require('passport-twitter').Strategy;

var log4js = require('log4js');
var logger = log4js.getLogger('config/bootstrap');

var verifyHandler = function(token, tokenSecret, profile, done) {
  process.nextTick(function() {

    User.findOne({
      uid: profile.id
    }, function(err, user) {
      if (user) {
        return done(null, user);
      } else {

        var data = {
          provider: profile.provider,
          uid: profile.id,
          name: profile.displayName
        };

        if (profile.emails && profile.emails[0] && profile.emails[0].value) {
          data.email = profile.emails[0].value;
        }
        if (profile.name && profile.name.givenName) {
          data.firstname = profile.name.givenName;
        }
        if (profile.name && profile.name.familyName) {
          data.lastname = profile.name.familyName;
        }

        User.create(data, function(err, user) {
          return done(err, user);
        });
      }
    });
  });
};

module.exports.bootstrap = function(cb) {

  if (process.env.FLUENTD_HOST) {
    log4js.addAppender(require('fluent-logger').support.log4jsAppender('api', {
      host: process.env.FLUENTD_HOST,
      timeout: 3.0
    }));
  }

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      id: id
    }, function(err, user) {
      done(err, user);
    });
  });

  if (sails.config.oauth.github.clientID && sails.config.oauth.github.clientSecret) {
    passport.use(new GitHubStrategy({
      clientID: sails.config.oauth.github.clientID,
      clientSecret: sails.config.oauth.github.clientSecret,
      callbackURL: sails.config.serverUrl + '/auths/github/callback'
    }, verifyHandler));
  }

  if (sails.config.oauth.google.clientID && sails.config.oauth.google.clientSecret) {
    passport.use(new GoogleStrategy({
      clientID: sails.config.oauth.google.clientID,
      clientSecret: sails.config.oauth.google.clientSecret,
      callbackURL: sails.config.serverUrl + '/auths/google/callback'
    }, verifyHandler));
  }

  if (sails.config.oauth.twitter.consumerKey && sails.config.oauth.twitter.consumerSecret) {
    passport.use(new TwitterStrategy({
      consumerKey: sails.config.oauth.twitter.consumerKey,
      consumerSecret: sails.config.oauth.twitter.consumerSecret,
      callbackURL: sails.config.serverUrl + '/auths/twitter/callback'
    }, verifyHandler));
  }

  cb();
};
