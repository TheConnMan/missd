module.exports.policies = {

  '*': true,

  'JobController': {
    '*': 'isAuthenticated'
  },
  'KeyController': {
    '*': 'isAuthenticated'
  },
  'NotificationController': {
    '*': 'isAuthenticated'
  },
  'UserController': {
    '*': 'isAuthenticated'
  }
};
