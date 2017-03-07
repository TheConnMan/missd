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
  }
};
