module.exports = {
  index: function(req, res) {
    var data = {
      user: req.user
    };
    if (req.user) {
      res.view(data);
    } else {
      res.view('home/landing', data);
    }
  }
};
