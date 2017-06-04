module.exports.policies = {

  '*': true,

  'JobController': {
    '*': 'isAuthenticated'
  },
  'EventController': {
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
