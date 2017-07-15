module.exports = {
  ingest: function(req, res) {
      JobService.process(req.param('key')).then(() => res.send(200));
  },

  expire: function(req, res) {
      JobService.forceExpire(req.param('key')).then(() => res.send(200));
  }
};
