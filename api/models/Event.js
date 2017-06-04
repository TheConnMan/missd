module.exports = {

  attributes: {
    job: { model: 'job' },
    user: { model: 'user' },
    alarm: {
      type: 'Boolean',
      defaultsTo: false
    }
  }
};
