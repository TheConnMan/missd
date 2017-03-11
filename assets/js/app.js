angular
.module('app', ['ngResource'])
.controller('controller', function($scope, $http, $resource) {

  var Job = $resource('/jobs/:id');

  $scope.jobs = Job.query();
});
