'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  createUsers(db).then(() => {
    return createJobs(db);
  }).then(() => {
    return createEvents(db);
  }).then(() => {
    return createNotifications(db);
  }).then(callback);
};

exports.down = function(db, callback) {
  return db.dropTable('notification', null, db.dropTable('event', null, db.dropTable('job', null, db.dropTable('user', null, callback))));
};

exports._meta = {
  "version": 1
};

function createUsers(db) {
  return new Promise((resolve, reject) => {
    db.createTable('user', {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true
      },
      provider: 'string',
      uid: 'string',
      name: 'string',
      email: 'string',
      firstname: 'string',
      lastname: 'string',
      createdAt: 'datetime',
      updatedAt: 'datetime'
    }, resolve);
  });
}

function createJobs(db) {
  return new Promise((resolve, reject) => {
    db.createTable('job', {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true
      },
      name: 'string',
      timeout: 'int',
      lastActive: 'datetime',
      expired: 'boolean',
      key: {
        type: 'string',
        unique: true
      },
      user: {
        type: 'int',
        foreignKey: {
          name: 'job_user_id_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE'
          },
          mapping: 'id'
        }
      },
      createdAt: 'datetime',
      updatedAt: 'datetime'
    }, resolve);
  });
}

function createEvents(db) {
  return new Promise((resolve, reject) => {
    db.createTable('event', {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true
      },
      job: {
        type: 'int',
        foreignKey: {
          name: 'event_job_id_fk',
          table: 'job',
          rules: {
            onDelete: 'CASCADE'
          },
          mapping: 'id'
        }
      },
      user: {
        type: 'int',
        foreignKey: {
          name: 'event_user_id_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE'
          },
          mapping: 'id'
        }
      },
      alarm: 'boolean',
      createdAt: 'datetime',
      updatedAt: 'datetime'
    }, resolve);
  });
}

function createNotifications(db) {
  return new Promise((resolve, reject) => {
    db.createTable('notification', {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true
      },
      exportType: 'string',
      data: 'text',
      job: {
        type: 'int',
        foreignKey: {
          name: 'notification_job_id_fk',
          table: 'job',
          rules: {
            onDelete: 'CASCADE'
          },
          mapping: 'id'
        }
      },
      createdAt: 'datetime',
      updatedAt: 'datetime'
    }, resolve);
  });
}
