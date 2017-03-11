angular
.module('app', ['ngResource', 'angularMoment'])
.controller('controller', function($scope, $http, $resource) {

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

  $scope.getTime = function(date) {
    return new Date(date).getTime();
  };

  $scope.formatDuration = function(duration) {
    return moment.duration(duration).format();
  };
});
