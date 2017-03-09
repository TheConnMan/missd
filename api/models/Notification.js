module.exports = {

  attributes: {
    name: {
      type: 'String',
      minLength: 4,
      required: true
    },
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
