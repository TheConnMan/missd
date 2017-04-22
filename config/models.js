var sailsLogger = require('sails-persistence-logger')({
  level: 'debug'
});

module.exports.models = {
  connection: process.env.MYSQL_HOST ? 'mysql' : 'localDiskDb',

  migrate: process.env.MYSQL_HOST ? 'safe' : 'alter',

  afterCreate: sailsLogger.afterCreate,
  afterUpdate: sailsLogger.afterUpdate,
  afterDestroy: sailsLogger.afterDestroy
};
