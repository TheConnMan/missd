module.exports = {
  ingest: function(req, res) {
      JobService.process(req.param('key')).then(response => res.send(response));
  }
};
