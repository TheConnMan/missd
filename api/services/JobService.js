var Promise = require('bluebird');

var Timer = require('node-distributed-timer');

var log4js = require('log4js');
var logger = log4js.getLogger('api/services/JobService');

var timer = new Timer({
  connection: {
    host: process.env.REDIS_HOST || 'localhost'
  },
  tasks: {
    expire: function(id) {
      Job.findOne({
        id: id
      })
      .populate('notifications')
      .then(job => {
        logger.info('Processing ' + job.id + ' (' + job.name + ')');
        job.expired = true;
        return Promise.all([job.save(), ExportService.process(job, job.notifications)]);
      });
    }
  }
});

module.exports = {
  process: function(key) {
    key.lastUsed = new Date();
    return Promise.all([key.save(), Job.findOne({ id: key.job }).populate('notifications')]).then(([key, job]) => {
      logger.debug('Resetting ' + job.id + ' (' + job.name + ')');
      this.clear(job.id);
      this.kickoff(job);
      job.lastActive = new Date();
      var promises = [];
      if (job.expired) {
        job.expired = false;
        promises.push(ExportService.process(job, job.notifications));
      }
      promises.push(job.save());
      return Promise.all(promises).then(() => {
        return 200;
      });
    });
  },

  kickoff: function(job) {
    timer.schedule('expire', job.id, job.timeout * 1000);
  },

  clear: function(id) {
    timer.clear('expire', id);
  }
};
