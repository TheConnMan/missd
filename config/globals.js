module.exports.globals = {
  proxy: process.env.PROXY_URL || 'http://localhost:4200',
  proxyEnabled: process.env.PROXY_ENABLED === undefined ? false : process.env.PROXY_ENABLED === 'true'
};
