angular
.module('app', ['ngResource', 'angularMoment', 'ngRoute'])

.controller('MainController', function($scope, $http, $resource, $route, $routeParams, $location) {

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
  });

  $scope.delete = function(job) {
    job.$delete(function(data) {
      $scope.jobs = $scope.jobs.filter(function(j) {
        return j.id !== job.id;
      });
    });
  };

  $scope.edit = function(job) {
    $location.path('/job/' + job.id);
  };

  $scope.new = function() {
    $location.path('/job/new');
  };

  $scope.getTime = function(date) {
    return new Date(date).getTime();
  };

  $scope.formatDuration = function(duration) {
    return moment.duration(duration).format();
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
    });
  });

  $scope.save = function() {
    $scope.job.$save(function(job) {
      if ($scope.new) {
        $scope.jobs.push(job);
        $location.path('/job/' + job.id);
      } else {
        $location.path('/');
      }
    });
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
  };

  $scope.save = function(notification) {
    notification.$save(function(data) {
      notification = data;
    });
  };

  $scope.delete = function(notification) {
    $scope.job.notifications.splice($scope.job.notifications.indexOf(notification), 1);
    if (notification.id) {
      notification.$delete();
    }
  };

  $scope.notificationInProgress = function() {
    return !$scope.job || !$scope.job.notifications.every(function(notification) {
      return notification.id;
    });
  };
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
  });
});
