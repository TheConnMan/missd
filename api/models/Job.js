module.exports = {

  attributes: {
    name: 'String',
    timeout: 'Integer',

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
