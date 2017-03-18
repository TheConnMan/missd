module.exports = {

  find: function(req, res) {
    return Event.find({
      user: req.session.passport.user
    }).then(events => {
      res.ok(events);
    });
  },

  findOne: function(req, res) {
    return Event.findOne({
      id: req.params.id,
      user: req.session.passport.user
    }).then(event => {
      if (event) {
        return res.ok(event);
      } else {
        return res.notFound();
      }
    });
  },

  create: function(req, res) {
    res.badRequest('Creating events is not supported');
  },

  update: function(req, res) {
    res.badRequest('Updating events is not supported');
  },

  destroy: function(req, res) {
    res.badRequest('Deleting events is not supported');
  }
};
