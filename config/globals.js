var SDC = require('statsd-client');

var REPO_ROOT = 'https://github.com/TheConnMan/missd/';
var version = process.env.npm_package_version;
var commit = (version || '').split('-').length === 1 ? null : version.split('-')[1].slice(0, 7);

var tags = (process.env.STATSD_TAGS ? process.env.STATSD_TAGS.split(',') : []).reduce((allTags, tag) => {
  var pair = tag.split(':');
  allTags[pair[0].trim()] = pair.length === 1 ? true : pair[1].trim();
  return allTags;
}, {});

module.exports.globals = {
  version: commit ? version.split('-')[0] + '-' + commit : version,
  versionLink: commit ? REPO_ROOT + 'commit/' + commit : REPO_ROOT + 'releases/tag/v' + version,
  proxy: process.env.PROXY_URL || 'http://localhost:4200',
  proxyEnabled: process.env.PROXY_ENABLED === undefined ? false : process.env.PROXY_ENABLED === 'true',

  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  fromEmail: process.env.FROM_EMAIL,
  emailEnabled: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.FROM_EMAIL,

  statsd: new SDC({
    host: process.env.STATSD_HOST || 'localhost',
    tags: tags
  })
};
