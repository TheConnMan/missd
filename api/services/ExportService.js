var SlackWebhook = require('slack-webhook');
var ses = require('node-ses');
var emailClient = sails.config.globals.emailEnabled ? ses.createClient({
  key: sails.config.globals.awsAccessKeyId,
  secret: sails.config.globals.awsSecretAccessKey
}) : null;

var dateFormat = require('dateformat');

var log4js = require('log4js');
var logger = log4js.getLogger('api/services/ExportService');

if (!emailClient) {
  logger.warn('Email is not configured, email notifications will not be sent');
}

module.exports = {
  slack: function(job, notification) {
    if (notification.data.slackUrl) {
      var slack = new SlackWebhook(notification.data.slackUrl);
      return slack.send({
        text: getText(job, notification),
        username: 'Miss.d'
      });
    } else {
      logger.error('Slack notification requires a URL: ' + notification.id);
      return;
    }
  },

  email: function(job, notification) {
    return new Promise((resolve, reject) => {
      if (emailClient) {
        emailClient.sendEmail({
          to: notification.data.email,
          from: sails.config.globals.fromEmail,
          subject: 'Miss.d: Job ' + job.name + (job.expired ? ' Expiration' : ' Reenabled'),
          message: getText(job, notification)
        }, (err, data, res) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      } else {
        logger.error('Email not configured');
        resolve();
      }
    });
  },

  default: function(job, notification) {

  },

  process: function(job, notifications) {
    return Promise.all(notifications.map(notification => {
      logger.debug('Exporting ' + (job.expired ? 'expire' : 'reenable') + ' ' + notification.exportType + ' notification ' + notification.name + ' (' + notification.id + ')');
      var fn = this[notification.exportType] || this.default;
      return fn(job, notification);
    }));
  }
};

function getText(job, notification) {
  return job.expired ? expiredText(job, notification) : reenableText(job, notification);
}

function expiredText(job, notification) {
  return 'Job ' + job.name + ' has expired, ' + (job.lastActive ? 'last active at ' + dateFormat(job.lastActive, 'mm/dd/yyyy HH:MM Z') : 'never active');
}

function reenableText(job, notification) {
  return 'Job ' + job.name + ' has checked in and has been reenabled';
}
