module.exports = {

  attributes: {
    name: 'String',
    exportType: {
      type: 'String',
      enum: ['slack', 'email']
    },

    data: {
      type: 'json',
      defaultsTo: '{}'
    },

    job: { model: 'job' }
  }
};
