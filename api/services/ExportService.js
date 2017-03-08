var SlackWebhook = require('slack-webhook');
var ses = require('node-ses');
var emailClient = ses.createClient({
  key: sails.config.globals.awsAccessKeyId,
  secret: sails.config.globals.awsSecretAccessKey
});

var dateFormat = require('dateformat');

var log4js = require('log4js');
var logger = log4js.getLogger('api/services/ExportService');

module.exports = {
  slack: function(job, notification) {
    var slack = new SlackWebhook(notification.data.slackUrl);
    return slack.send({
      text: notificationText(job, notification),
      username: 'Miss.d'
    });
  },

  email: function(job, notification) {
    return new Promise((resolve, reject) => {
      emailClient.sendEmail({
        to: notification.data.email,
        from: sails.config.globals.fromEmail,
        subject: 'Job ' + job.name + ' Expiration',
        message: notificationText(job, notification)
      }, (err, data, res) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  default: function(job, notification) {

  },

  process: function(job, notifications) {
    return Promise.all(notifications.map(notification => {
      logger.debug('Exporting ' + notification.exportType + ' notification ' + notification.name + ' (' + notification.id + ')');
      var fn = this[notification.exportType] || this.default;
      return fn(job, notification);
    }));
  }
};

function notificationText(job, notification) {
  return 'Job ' + job.name + ' has expired, ' + (job.lastActive ? 'last active at ' + dateFormat(job.lastActive, 'mm/dd/yyyy HH:MM Z') : 'never active');
}
