var passport = require('passport');

var log4js = require('log4js');
var logger = log4js.getLogger('api/controllers/AuthController');

var statsd = sails.config.globals.statsd;

module.exports = {

  index: function(req, res) {
    res.view();
  },

  logout: function(req, res) {
    statsd.increment('missd.counter.logouts');
    req.logout();
    res.redirect('/');
  },

  github: function(req, res) {
    passport.authenticate('github', {
      failureRedirect: '/login'
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          logger.error(err);
          res.view('500');
          return;
        }

        statsd.increment('missd.counter.logins');
        logger.info(user.name + ' has logged in');
        res.redirect('/');
        return;
      });
    })(req, res);
  }
};
