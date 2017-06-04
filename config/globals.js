var REPO_ROOT = 'https://github.com/TheConnMan/missd/';
var version = process.env.npm_package_version;
var commit = (version || '').split('-').length === 1 ? null : version.split('-')[1].slice(0, 7);

module.exports.globals = {
  version: commit ? version.split('-')[0] + '-' + commit : version,
  versionLink: commit ? REPO_ROOT + 'commit/' + commit : REPO_ROOT + 'releases/tag/v' + version,
  proxy: process.env.PROXY_URL || 'http://localhost:4200',
  proxyEnabled: process.env.PROXY_ENABLED === undefined ? false : process.env.PROXY_ENABLED === 'true',

  redisHost: process.env.REDIS_HOST || 'localhost',

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  fromEmail: process.env.FROM_EMAIL,
  emailEnabled: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.FROM_EMAIL
};
