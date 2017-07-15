module.exports.routes = {
  '/': 'HomeController.index',

  '/logout': 'AuthController.logout',

  'POST /ingest/:key': 'IngestController.ingest',

  'POST /ingest/:key/expire': 'IngestController.expire'
};
