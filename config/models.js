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
    sails.config.globals.statsd.increment('missd.counter.models.' + this.identity.toLowerCase() + '.create');
    sailsLogger.afterCreate(record, this).then(data => {
      cb();
    });
  },
  afterUpdate: function(record, cb) {
    sails.config.globals.statsd.increment('missd.counter.models.' + this.identity.toLowerCase() + '.update');
    sailsLogger.afterUpdate(record, this).then(data => {
      cb();
    });
  },
  afterDestroy: function(record, cb) {
    sails.config.globals.statsd.increment('missd.counter.models.' + this.identity.toLowerCase() + '.destroy');
    sailsLogger.afterDestroy(record, this).then(data => {
      cb();
    });
  }
};
