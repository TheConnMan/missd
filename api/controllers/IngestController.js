module.exports = {
  ingest: function(req, res) {
    Key.findOne({
      key: req.param('key')
    }).then(apiKey => {
      if (!apiKey) {
        res.send(401);
      } else {
        JobService.process(apiKey).then(response => res.send(response));
      }
    });
  }
};
