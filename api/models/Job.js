module.exports = {

  attributes: {
    name: {
      type: 'String',
      minLength: 4,
      required: true
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

    notifications: {
      collection: 'notification',
      via: 'job'
    },

    keys: {
      collection: 'key',
      via: 'job'
    },

    user: { model: 'user' }
  }
};
