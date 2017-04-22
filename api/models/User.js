module.exports = {

  attributes: {
    provider: 'String',
    uid: 'String',
    name: 'String',
    email: 'String',
    firstname: 'String',
    lastname: 'String',

    jobs: {
      collection: 'job',
      via: 'user'
    },

    events: {
      collection: 'event',
      via: 'user'
    }
  },

  beforeDestroy: function(criteria, cb) {
    User.find(criteria).populate('jobs').then(users => {
      return deleteJobs(users);
    }).then(() => {
      cb();
    });
  }
};

function deleteJobs(users) {
  var ids = [].concat.apply([], users.map(user => user.jobs)).map(job => job.id);
  if (ids.length === 0) {
    return;
  } else {
    return Job.destroy({
      id: ids
    });
  }
}
