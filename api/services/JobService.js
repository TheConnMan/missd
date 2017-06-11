var Promise = require('bluebird');

var Timer = require('node-distributed-timer');

var log4js = require('log4js');
var logger = log4js.getLogger('api/services/JobService');

var statsd = sails.config.globals.statsd;

function expire(job) {
  statsd.increment('missd.counter.job.expired');
  logger.info('Processing ' + job.id + ' (' + job.name + ')');
  job.expired = true;
  return Promise.all([
    Event.create({
      job: job,
      user: job.user,
      alarm: true
    }),
    job.save(),
    ExportService.process(job, job.notifications)
  ]);
}

var timer = new Timer({
  connection: {
    host: sails.config.globals.redisHost
  },
  tasks: {
    expire: function(id) {
      Job.findOne({
        id: id
      })
      .populate('notifications')
      .then(job => {
        expire(job);
      });
    }
  }
});

module.exports = {
  process: function(key) {
    statsd.increment('missd.counter.job.payloads');
    return Job.findOne({ key: key }).populate('notifications').then((job) => {
      this.clear(job.id);
      this.kickoff(job);
      job.lastActive = new Date();
      var promises = [];
      if (job.expired) {
        statsd.increment('missd.counter.job.reenabled');
        job.expired = false;
        promises.push(ExportService.process(job, job.notifications));
        promises.push(Event.create({
          job: job,
          user: job.user,
          alarm: false
        }));
      }
      promises.push(job.save());
      return Promise.all(promises).then(() => {
        return 200;
      });
    });
  },

  getKeys: function() {
    return timer.getKeys();
  },

  kickoff: function(job) {
    timer.clear('expire', job.id);
    timer.schedule('expire', job.id, job.timeout * 1000);
  },

  clear: function(id) {
    timer.clear('expire', id);
  },

  expire
};
