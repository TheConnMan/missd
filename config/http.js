var proxy = require('express-http-proxy');

module.exports.http = {
  middleware: {

    custom: true,

    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),

    order: [
            'startRequestTimer',
            'cookieParser',
            'session',
            'passportInit',
            'passportSession',
            'myRequestLogger',
            'bodyParser',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            'poweredBy',
            '$custom',
            'router',
            'www',
            'favicon',
            '404',
            '500'
          ]
  },

  customMiddleware: function(app) {
    app.use(proxy(sails.config.globals.proxy, {
      filter: function(req, res) {
        return sails.config.globals.proxyEnabled && req.path.match(/^\/(?!(auths|users)).*/);
      }
    }));
  }
};
