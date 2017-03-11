angular
.module('app', ['ngResource', 'angularMoment', 'ngRoute'])

.controller('MainController', function($scope, $http, $resource, $route, $routeParams, $location) {

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  var Job = $resource('/jobs/:jobId', {
    jobId: '@id'
  });

  $scope.jobs = Job.query();

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

.controller('JobController', function($scope, $routeParams, $resource, $location) {
  $scope.params = $routeParams;

  $scope.new = $scope.params.jobId === 'new';

  var Job = $resource('/jobs/:jobId', {
    jobId: '@id'
  });

  var jobs = $scope.jobs.filter(function(job) {
    return job.id == $scope.params.jobId;
  });

  if (!$scope.new && jobs.length === 0) {
    $location.path('/job/new');
  }

  $scope.job = $scope.new ? new Job({
    name: 'New Job',
    timeout: 3600
  }) : jobs[0];

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
