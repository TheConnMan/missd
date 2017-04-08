angular
.module('app', ['ngResource', 'angularMoment', 'ngRoute', 'angular-clipboard'])

.controller('MainController', function($scope, $http, $resource, $route, $routeParams, $location, $timeout) {

  localStorage.login = true;

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.dataLoaded = 0;

  var Job = $resource('/jobs/:jobId', {
    jobId: '@id'
  });

  var Event = $resource('/events/:eventId', {
    eventId: '@id'
  });

  var Notification = $resource('/notifications/:notificationId', {
    notificationId: '@id'
  });

  $scope.jobs = Job.query(function() {
    $scope.dataLoaded++;
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

  $scope.events = Event.query(() => {
    $scope.dataLoaded++;
  });

  $scope.$on('$viewContentLoaded', function() {
    $scope.dataLoaded++;
    if ($scope.dataLoaded > 3) {
      $scope.refreshDatapoints();
    }
  });

  $scope.$watch('dataLoaded', () => {
    if ($scope.dataLoaded === 3) {
      $scope.refreshDatapoints();
    }
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

  $scope.eventTable = function() {
    $location.path('/events');
  };

  $scope.jobChecks = function(job) {
    return $scope.events.filter(event => event.job === job.id && !event.alarm);
  };

  $scope.jobAlarms = function(job) {
    return $scope.events.filter(event => event.job === job.id && event.alarm);
  };

  $scope.getTime = function(date) {
    return new Date(date).getTime();
  };

  $scope.getJob = function(id) {
    var jobs = $scope.jobs.filter(job => job.id === id);
    return jobs.length === 1 ? jobs[0] : null;
  };

  $scope.formatDuration = function(duration) {
    return moment.duration(duration).format('d [days], h [hrs], m [min], s [sec]');
  };

  $scope.formatDate = function(date) {
    return moment(date).format('MM/DD/YYYY HH:mm:ss');
  };

  $scope.relativeDate = function(date) {
    return moment(date).fromNow();
  };

  $scope.ingestUrl = function(key) {
    return serverUrl + '/ingest/' + key;
  };

  var hours = Array.apply(null, Array(7 * 24)).map((val, i) => {
    return moment().startOf('hour').subtract({
      hours: i
    }).toDate();
  });

  $scope.refreshDatapoints = function() {
    var jobsWithEvents = $scope.jobs.filter(job => {
      return $scope.events.filter(event => event.job === job.id && event.alarm).length;
    });
    var columns = jobsWithEvents.map(job => {
      var data = hours.map(date => {
        return $scope.events.filter(event => event.job === job.id && event.alarm && moment(event.createdAt).startOf('hour').toDate().getTime() === date.getTime()).length;
      }, {});
      data.unshift(job.id + ': ' + job.name);
      return data;
    });
    c3.generate({
      bindto: '#chart',
      size: {
        height: 200
      },
      data: {
        x: 'dates',
        type: 'bar',
        columns: [
          ['dates'].concat(hours)
        ].concat(columns),
        groups: [
          jobsWithEvents.map(job => job.id + ': ' + job.name)
        ]
      },
      bar: {
        width: {
          ratio: 0.9
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%m/%d %H:%M'
          }
        }
      }
    });
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

.controller('EventController', function($scope) {

  $scope.eventTypes = [{
    label: 'Alarm',
    alarm: true
  }, {
    label: 'Check',
    alarm: false
  }];

  $scope.filters = [];

  $scope.filteredEvents = function() {
    return $scope.events.filter($scope.eventFilter);
  };

  $scope.addFilter = function(field, value, added) {
    $scope.filters.push({ field, value, added });
  };

  $scope.removeFilter = function(field, value, added) {
    $scope.filters.splice($scope.filters.indexOf({ field, value, added }), 1);
  };

  $scope.eventFilter = function(event) {
    var mapFilters = $scope.filters.reduce((map, filter) => {
      if (!map[filter.field]) {
        map[filter.field] = [];
      }
      map[filter.field].push({
        value: filter.value,
        added: filter.added
      });
      return map;
    }, {});
    return Object.keys(mapFilters).reduce((matches, key) => {
      return matches && !mapFilters[key].reduce((selectionMatches, selection) => {
        return selectionMatches || (event[key] !== selection.value && selection.added) || (event[key] === selection.value && !selection.added);
      }, false);
    }, true);
  };

  $scope.uniqueJobs = function() {
    return $scope.jobs.filter(job => {
      return $scope.filteredEvents().filter(event => event.job === job.id).length !== 0;
    });
  };

  $scope.jobEventCount = function(job) {
    return $scope.filteredEvents().filter(event => event.job === job.id).length;
  };

  $scope.uniqueEventTypes = function() {
    return $scope.eventTypes.filter(type => {
      return $scope.filteredEvents().filter(event => event.alarm === type.alarm).length !== 0;
    });
  };

  $scope.eventTypeCount = function(eventType) {
    return $scope.filteredEvents().filter(event => event.alarm === eventType.alarm).length;
  };
})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
      templateUrl : "/templates/index.html"
  })
 .when('/events', {
    templateUrl: '/templates/events.html',
    controller: 'EventController'
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
