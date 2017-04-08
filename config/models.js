var sailsLogger = require('sails-persistence-logger')({
  level: 'debug'
});

module.exports.models = {
  connection: process.env.MYSQL_HOST ? 'mysql' : 'localDiskDb',

  migrate: 'alter',

  afterCreate: sailsLogger.afterCreate,
  afterUpdate: sailsLogger.afterUpdate,
  afterDestroy: sailsLogger.afterDestroy
};
