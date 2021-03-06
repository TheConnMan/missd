var os = require('os');
var passport = require('passport'), GitHubStrategy = require('passport-github2').Strategy;

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
    var tags = (process.env.FLUENTD_TAGS ? process.env.FLUENTD_TAGS.split(',') : []).reduce((allTags, tag) => {
      var pair = tag.split(':');
      allTags[pair[0].trim()] = pair.length === 1 ? true : pair[1].trim();
      return allTags;
    }, {});
    tags.function = 'Miss.d';
    tags.hostname = os.hostname();
    log4js.addAppender(require('fluent-logger').support.log4jsAppender('api', {
      host: process.env.FLUENTD_HOST,
      timeout: 3.0,
      tags
    }));
  }

  ExportService.init();

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

  passport.use(new GitHubStrategy({
    clientID: sails.config.oauth.github.clientID,
    clientSecret: sails.config.oauth.github.clientSecret,
    callbackURL: sails.config.serverUrl + '/auths/github/callback'
  }, verifyHandler));

  JobService.getKeys().then(keys => {
    var query = {
      expired: false
    };
    if (keys.length != 0) {
      query.id = {
        not: keys.map(key => key.id)
      };
    }
    Job.find(query)
    .populate('notifications')
    .then(jobs => {
      if (jobs.length !== 0) {
        logger.warn(jobs.length + ' job(s) expired while Miss.d was down, sending notifications');
        jobs.forEach(job => {
          JobService.expire(job);
        });
      }

      cb();
    });
  });
};
