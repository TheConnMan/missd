module.exports = {

  attributes: {
    name: 'String',
    timeout: 'Integer',
    lastActive: 'datetime',

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
