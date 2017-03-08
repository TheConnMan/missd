var SlackWebhook = require('slack-webhook');
var dateFormat = require('dateformat');

var log4js = require('log4js');
var logger = log4js.getLogger('api/services/ExportService');

module.exports = {
  slack: function(job, notification) {
    logger.debug('Exporting Slack notification ' + notification.name + ' (' + notification.id + ')');
    var slack = new SlackWebhook(notification.data.slackUrl);
    return slack.send({
      text: notificationText(job, notification),
      username: 'Miss.d'
    });
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

function notificationText(job, notification) {
  return 'Job ' + job.name + ' has expired, ' + (job.lastActive ? 'last active at ' + dateFormat(job.lastActive, 'mm/dd/yyyy HH:MM Z') : 'never active');
}
