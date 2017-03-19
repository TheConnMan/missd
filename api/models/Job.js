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
  }
};
