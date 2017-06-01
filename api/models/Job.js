module.exports = {

  attributes: {
    name: {
      type: 'String',
      minLength: 4,
      required: true
    },
    description: {
      type: 'text',
    },
    timeout: {
      type: 'Integer',
      min: 10,
      required: true
    },
    lastActive: 'datetime',
    expired: {
      type: 'Boolean',
      defaultsTo: false
    },
    key: {
      type: 'String',
      unique: true
    },

    notifications: {
      collection: 'notification',
      via: 'job'
    },

    events: {
      collection: 'event',
      via: 'job'
    },

    user: { model: 'user' }
  },

  beforeDestroy: function(criteria, cb) {
    Job.find(criteria).populate('events').populate('notifications').then(jobs => {
      return Promise.all([deleteEvents(jobs), deleteNotifications(jobs)]);
    }).then(() => {
      cb();
    });
  }
};

function deleteEvents(jobs) {
  var ids = [].concat.apply([], jobs.map(job => job.events)).map(event => event.id);
  if (ids.length === 0) {
    return;
  } else {
    return Event.destroy({
      id: ids
    });
  }
}

function deleteNotifications(jobs) {
  var ids = [].concat.apply([], jobs.map(job => job.notifications)).map(notification => notification.id);
  if (ids.length === 0) {
    return;
  } else {
    return Notification.destroy({
      id: ids
    });
  }
}
