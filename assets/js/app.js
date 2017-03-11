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

  $scope.getTime = function(date) {
    return new Date(date).getTime();
  };

  $scope.formatDuration = function(duration) {
    return moment.duration(duration).format();
  };
})

.controller('JobController', function($scope, $routeParams, $resource) {
  $scope.params = $routeParams;
})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
      templateUrl : "/templates/index.html"
  })
 .when('/job/:jobId', {
    templateUrl: '/templates/job.html',
    controller: 'JobController'
  });
});
