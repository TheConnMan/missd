var log4js = require('log4js');
var logger = log4js.getLogger('api/services/ExportService');

module.exports = {
  slack: function(job, notification) {
    logger.info('Exporting Slack');
  },

  email: function(job, notification) {
    logger.info('Exporting email');
  },

  default: function(job, notification) {
    logger.info('Exporting default');
  },

  process: function(job, notifications) {
    return Promise.all(notifications.map(notification => {
      var fn = this[notification.exportType] || this.default;
      return fn(job, notification);
    }));
  }
};
