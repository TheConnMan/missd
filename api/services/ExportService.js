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

var statsd = sails.config.globals.statsd;

module.exports = {
  init: function() {
    if (!emailClient) {
      logger.warn('Email is not configured, email notifications will not be sent');
    }
  },

  slack: function(job, notification, data) {
    if (notification.data.slackUrl) {
      var slack = new SlackWebhook(notification.data.slackUrl);
      return slack.send({
        username: 'Miss.d',
        attachments: [{
          color: data.color,
          title: data.title,
          text: data.description,
          title_link: data.url,
          fields:[{
            title: 'Last Active',
            value: data.lastActive
          }]
        }]
      });
    } else {
      logger.error('Slack notification requires a URL: ' + notification.id);
      return;
    }
  },

  email: function(job, notification, data) {
    return new Promise((resolve, reject) => {
      if (emailClient) {
        alertTemplate.render({
          job,
          data
        }, function(err, result) {
          if (err) {
            reject(err);
          } else {
            emailClient.sendEmail({
              to: notification.data.email,
              from: sails.config.globals.fromEmail,
              subject: data.subject,
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
      logger.info('Exporting ' + (job.expired ? 'expire' : 'reenable') + ' ' + notification.exportType + ' notification ' + notification.id);
      var data = {
        username: 'Miss.d',
        color: job.expired ? '#ff4444' : '#4DBD33',
        title: job.name + ' ' + (job.expired ? 'Expired' : 'Reenabled'),
        url: sails.config.serverUrl,
        subject: 'Miss.d: ' + job.name + (job.expired ? ' Expiration' : ' Reenabled'),
        description: job.description,
        summary: job.name + ' has ' + (job.expired ? 'just expired' : 'been reenabled'),
        message: getText(job, notification),
        lastActive: job.lastActive ? dateFormat(job.lastActive, 'mm/dd/yyyy HH:MM Z') : 'Never'
      };
      var fn = this[notification.exportType] || this.default;
      statsd.increment('missd.counter.export.total');
      statsd.increment('missd.counter.export.' + notification.exportType);
      return fn(job, notification, data);
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
