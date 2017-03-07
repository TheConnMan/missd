module.exports.policies = {

  '*': true,

  'UserController': {
    '*': 'isAuthenticated'
  }
};
