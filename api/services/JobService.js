module.exports = {
  process: function(key) {
    key.lastUsed = new Date();
    return key.save().then(() => {
      return 200;
    });
  }
};
