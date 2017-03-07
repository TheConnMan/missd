var passport = require('passport');

module.exports = {

  index: function(req, res) {
    res.view();
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  github: function(req, res) {
    passport.authenticate('github', {
      failureRedirect: '/login'
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  google: function(req, res) {
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  twitter: function(req, res) {
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  }
};
