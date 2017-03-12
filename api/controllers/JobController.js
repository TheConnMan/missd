var uuid = require('node-uuid');

module.exports = {

  find: function(req, res) {
    return Job.find({
      user: req.session.passport.user
    })
    .populate('notifications')
    .then(jobs => {
      return res.ok(jobs);
    });
  },

  findOne: function(req, res) {
    return Job.findOne({
      id: req.params.id,
      user: req.session.passport.user
    })
    .populate('notifications')
    .then(job => {
      if (job) {
        return res.ok(job);
      } else {
        return res.notFound();
      }
    });
  },

  create: function(req, res) {
    var body = req.body || {};
    return Job.create({
      name: body.name,
      timeout: body.timeout,
      user: req.session.passport.user,
      key: uuid.v4()
    }).then(job => {
      JobService.kickoff(job);
      return res.ok(job);
    }).catch(err => {
      return res.badRequest('Invalid attributes: ' + Object.keys(err.invalidAttributes).join(', '));
    });
  },

  update: function(req, res) {
    var body = req.body || {};
    return Job.findOne({
      id: req.params.id,
      user: req.session.passport.user
    })
    .populate('notifications')
    .then(job => {
      if (job) {
        var notifications = job.notifications;
        job.name = body.name;
        job.timeout = body.timeout;
        return job.save().then(() => {
          job.notifications = notifications;
          JobService.kickoff(job);
          return res.ok(job);
        });
      } else {
        res.notFound();
      }
    }).catch(err => {
      return res.badRequest('Invalid attributes: ' + Object.keys(err.invalidAttributes).join(', '));
    });
  },

  destroy: function(req, res) {
    return Job.findOne({
      id: req.params.id,
      user: req.session.passport.user
    }).then(job => {
      if (job) {
        return job.destroy().then(() => {
          JobService.clear(job.id);
          return res.ok(job);
        });
      } else {
        return res.notFound();
      }
    });
  }

};
