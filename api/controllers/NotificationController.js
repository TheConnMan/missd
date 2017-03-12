module.exports = {

  find: function(req, res) {
    return res.badRequest('List notifications is not supported');
  },

  findOne: function(req, res) {
    return Notification.findOne({
      id: req.params.id,
    }).then(notification => {
      if (notification) {
        return Job.findOne({
          id: notification.job,
          user: req.session.passport.user
        }).then(job => {
          if (job) {
            return res.ok(notification);
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
        return Notification.create({
          name: body.name,
          exportType: body.exportType,
          data: body.data,
          job: body.job
        }).then(notification => {
          return res.ok(notification);
        }).catch(err => {
          return res.badRequest('Invalid notification attributes: ' + Object.keys(err.invalidAttributes).join(', '));
        });
      } else {
        return res.badRequest('Invalid job ID ' + body.job);
      }
    });
  },

  update: function(req, res) {
    var body = req.body || {};
    return Job.findOne({
      id: body.job,
      user: req.session.passport.user
    }).then(job => {
      if (job) {
        return Notification.findOne({
          id: req.params.id
        }).then(notification => {
          if (notification) {
            notification.exportType = body.exportType;
            notification.data = body.data;
            return notification.save().then(() => {
              return res.ok(notification);
            });
          } else {
            res.notFound();
          }
        }).catch(err => {
          return res.badRequest('Invalid notification attributes: ' + Object.keys(err.invalidAttributes).join(', '));
        });
      } else {
        return res.badRequest('Invalid job ID ' + body.job);
      }
    });
  },

  destroy: function(req, res) {
    return Notification.findOne({
      id: req.params.id
    }).then(notification => {
      if (notification) {
        Job.findOne({
          id: notification.job,
          user: req.session.passport.user
        }).then(job => {
          if (job) {
            return notification.destroy().then(() => {
              return res.ok(notification);
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
