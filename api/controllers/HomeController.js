module.exports = {
  index: function(req, res) {
    res.view({
      user: req.user,
      github: sails.config.oauth.github.clientID && sails.config.oauth.github.clientSecret,
      google: sails.config.oauth.google.clientID && sails.config.oauth.google.clientSecret,
      twitter: sails.config.oauth.twitter.consumerKey && sails.config.oauth.twitter.consumerSecret
    });
  }
};
