var SlackWebhook = require('slack-webhook');
var ses = require('node-ses');
var emailClient = sails.config.globals.emailEnabled ? ses.createClient({
  key: sails.config.globals.awsAccessKeyId,
  secret: sails.config.globals.awsSecretAccessKey
}) : null;

var dateFormat = require('dateformat');

var EmailTemplate = require('email-templates').EmailTemplate;

var alertTemplate = new EmailTemplate('templates/alert');

var log4js = require('log4js');
var logger = log4js.getLogger('api/services/ExportService');

module.exports = {
  init: function() {
    if (!emailClient) {
      logger.warn('Email is not configured, email notifications will not be sent');
    }
  },

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
        alertTemplate.render({
          job,
          url: sails.config.serverUrl,
          action: job.expired ? 'Expired' : 'Reenabled',
          type: job.expired ? 'bad' : 'good',
          description: job.expired ? 'just expired' : 'been reenabled',
          message: getText(job, notification)
        }, function(err, result) {
          if (err) {
            reject(err);
          } else {
            emailClient.sendEmail({
              to: notification.data.email,
              from: sails.config.globals.fromEmail,
              subject: 'Miss.d: ' + job.name + (job.expired ? ' Expiration' : ' Reenabled'),
              message: result.html
            }, (err, data, res) => {
              if (err) {
                logger.error(err);
                reject(err);
              } else {
                resolve(data);
              }
            });
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
      logger.debug('Exporting ' + (job.expired ? 'expire' : 'reenable') + ' ' + notification.exportType + ' notification ' + notification.id);
      var fn = this[notification.exportType] || this.default;
      return fn(job, notification);
    }));
  }
};

function getText(job, notification) {
  return job.expired ? expiredText(job, notification) : reenableText(job, notification);
}

function expiredText(job, notification) {
  return job.name + ' has expired, ' + (job.lastActive ? 'last active at ' + dateFormat(job.lastActive, 'mm/dd/yyyy HH:MM Z') : 'never active');
}

function reenableText(job, notification) {
  return job.name + ' has checked in and has been reenabled';
}
