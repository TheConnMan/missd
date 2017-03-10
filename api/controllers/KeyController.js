module.exports = {

  find: function(req, res) {
    return res.badRequest('List keys is not supported');
  },

  findOne: function(req, res) {
    return Key.findOne({
      id: req.params.id,
    }).then(key => {
      if (key) {
        return Job.findOne({
          id: key.job,
          user: req.session.passport.user
        }).then(job => {
          if (job) {
            return res.ok(key);
          } else {
            return res.notFound();
          }
        });
      } else {
        return res.notFound();
      }
    });
  },

  create: function(req, res) {
    var body = req.body || {};
    return Job.findOne({
      id: body.job,
      user: req.session.passport.user
    }).then(job => {
      if (job) {
        return Key.create({
          job: body.job
        }).then(key => {
          return res.ok(key);
        });
      } else {
        return res.badRequest('Invalid job ID ' + body.job);
      }
    });
  },

  update: function(req, res) {
    return res.badRequest('Updating keys is not allowed');
  },

  destroy: function(req, res) {
    return Key.findOne({
      id: req.params.id
    }).then(key => {
      if (key) {
        Job.findOne({
          id: key.job,
          user: req.session.passport.user
        }).then(job => {
          if (job) {
            return key.destroy().then(() => {
              return res.ok(key);
            });
          } else {
            return res.notFound();
          }
        });
      } else {
        return res.notFound();
      }
    });
  }

};
