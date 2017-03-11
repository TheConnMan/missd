angular
.module('app', ['ngResource', 'angularMoment'])
.controller('controller', function($scope, $http, $resource) {

  var Job = $resource('/jobs/:id');

  $scope.jobs = Job.query();

  $scope.getTime = function(date) {
    return new Date(date).getTime();
  };

  $scope.formatDuration = function(duration) {
    return moment.duration(duration).format();
  };
});
