var SailsPersistenceLogger = require('sails-persistence-logger');

var sailsLogger = new SailsPersistenceLogger({
  level: 'debug',
  exclude: {
    job: ['UPDATE']
  }
});

module.exports.models = {
  connection: process.env.MYSQL_HOST ? 'mysql' : 'localDiskDb',

  migrate: process.env.MYSQL_HOST ? 'safe' : 'alter',

  afterCreate: function(record, cb) {
    sailsLogger.afterCreate(record, this).then(data => {
      cb();
    });
  },
  afterUpdate: function(record, cb) {
    sailsLogger.afterUpdate(record, this).then(data => {
      cb();
    });
  },
  afterDestroy: function(record, cb) {
    sailsLogger.afterDestroy(record, this).then(data => {
      cb();
    });
  }
};
