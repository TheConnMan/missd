module.exports = {

  attributes: {
    name: 'String',
    timeout: 'Integer',
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
