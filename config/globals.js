module.exports.globals = {
  proxy: process.env.PROXY_URL || 'http://localhost:4200',
  proxyEnabled: process.env.PROXY_ENABLED === undefined ? false : process.env.PROXY_ENABLED === 'true',

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  fromEmail: process.env.FROM_EMAIL
};
