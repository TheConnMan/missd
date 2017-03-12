angular
.module('app', ['ngResource', 'angularMoment', 'ngRoute', 'angular-clipboard'])

.controller('MainController', function($scope, $http, $resource, $route, $routeParams, $location, $timeout) {

  localStorage.login = true;

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  var Job = $resource('/jobs/:jobId', {
    jobId: '@id'
  });

  var Notification = $resource('/notifications/:notificationId', {
    notificationId: '@id'
  });

  $scope.jobs = Job.query(function() {
    $scope.jobs.forEach(function(job) {
      job.notifications = job.notifications ? job.notifications.map(function(notification) {
        return new Notification(notification);
      }) : [];
    });
    $timeout(function() {
      $('.popup').popup({
        position: 'top center',
        on: 'click'
      });
    });
  });

  $scope.delete = function(job) {
    job.$delete().then(function(data) {
      $scope.jobs = $scope.jobs.filter(function(j) {
        return j.id !== job.id;
      });
      $location.path('/');
    });
  };

  $scope.edit = function(job) {
    $location.path('/job/' + job.id);
  };

  $scope.new = function() {
    $location.path('/job/new');
  };

  $scope.help = function() {
    $location.path('/help');
  };

  $scope.getTime = function(date) {
    return new Date(date).getTime();
  };

  $scope.formatDuration = function(duration) {
    return moment.duration(duration).format('d [days], h [hrs], m [min], s [sec]');
  };

  $scope.ingestUrl = function(key) {
    return serverUrl + '/ingest/' + key;
  };
})

.controller('JobController', function($scope, $routeParams, $resource, $location, $timeout) {
  $scope.params = $routeParams;

  $scope.new = $scope.params.jobId === 'new';

  var Job = $resource('/jobs/:jobId', {
    jobId: '@id'
  });

  var Notification = $resource('/notifications/:notificationId', {
    notificationId: '@id'
  });

  $scope.$watchCollection('jobs', function() {
    var jobs = $scope.jobs.filter(function(job) {
      return job.id == $scope.params.jobId;
    });
    if (!$scope.new && $scope.jobs.$resolved && jobs.length === 0) {
      $location.path('/job/new');
    }
    $scope.job = $scope.new ? new Job({
      name: 'New Job',
      timeout: 3600
    }) : jobs[0];
    $timeout(function() {
      $('.ui.dropdown').dropdown();
      $('.popup').popup({
        position: 'top center',
        on: 'click'
      });
    });
  });

  $scope.save = function() {
    $scope.job.$save().then(function(job) {
      if ($scope.new) {
        $scope.jobs.push(job);
        $location.path('/job/' + job.id);
        if ($scope.jobs.length === 1) {
          swal({
            title: 'You created your first job!',
            html: 'Start sending in data by sending a POST to the link below. See the help for more instructions.<br><br><a href="' + $scope.ingestUrl(job.key) + '">' + $scope.ingestUrl(job.key) + '</a>',
            type: 'success',
            width: '70%'
          });
        }
      }
      $scope.error = '';
    }).catch(function(err) {
      $scope.error = err.data;
    });
  };

  $scope.changeJob = function(job) {
    job.dirty = true;
  };

  $scope.newNotification = function() {
    $scope.job.notifications = $scope.job.notifications || [];
    $scope.job.notifications.push(new Notification({
      name: 'New Notification',
      exportType: 'email',
      job: $scope.job.id
    }));
    $timeout(function() {
      $('.ui.dropdown').dropdown();
    });
  };

  $scope.updateType = function(notification, type) {
    notification.exportType = type;
    notification.data = {};
    $scope.changeNotification(notification);
  };

  $scope.saveNotification = function(notification) {
    notification.$save().then(function(data) {
      $scope.error = '';
      notification = data;
    }).catch(function(err) {
      $scope.error = err.data;
    });
  };

  $scope.deleteNotification = function(notification) {
    $scope.job.notifications.splice($scope.job.notifications.indexOf(notification), 1);
    if (notification.id) {
      notification.$delete();
    }
  };

  $scope.changeNotification = function(notification) {
    notification.dirty = true;
  };

  $scope.notificationInProgress = function() {
    return !$scope.job || ($scope.job.notifications && !$scope.job.notifications.every(function(notification) {
      return notification.id;
    }));
  };
})

.controller('HelpController', function($scope) {

})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
      templateUrl : "/templates/index.html"
  })
 .when('/job/:jobId', {
    templateUrl: '/templates/job.html',
    controller: 'JobController'
  })
 .when('/job/new', {
    templateUrl: '/templates/job.html',
    controller: 'JobController'
  })
 .when('/help', {
    templateUrl: '/templates/help.html',
    controller: 'HelpController'
  });
});
