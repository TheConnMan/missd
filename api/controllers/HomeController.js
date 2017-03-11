module.exports = {
  index: function(req, res) {
    var data = {
      user: req.user,
      github: sails.config.oauth.github.clientID && sails.config.oauth.github.clientSecret,
      google: sails.config.oauth.google.clientID && sails.config.oauth.google.clientSecret,
      twitter: sails.config.oauth.twitter.consumerKey && sails.config.oauth.twitter.consumerSecret
    };
    if (req.user) {
      res.view(data);
    } else {
      res.view('home/landing', data);
    }
  }
};
