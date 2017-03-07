var uuid = require('node-uuid');

module.exports = {

  attributes: {
    key: {
      type: 'String',
      defaultsTo: uuid.v4(),
      unique: true
    },
    lastUsed: 'datetime',

    job: { model: 'job' }
  }
};
