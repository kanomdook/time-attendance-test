// Reportmonthlies service used to communicate Reportmonthlies REST endpoints
(function () {
  'use strict';

  angular
    .module('reportmonthlies')
    .factory('ReportmonthliesService', ReportmonthliesService)
    .service('ReportmonthlyService', ReportmonthlyService);

  ReportmonthliesService.$inject = ['$resource'];

  function ReportmonthliesService($resource) {
    return $resource('api/reportmonthlies/:reportmonthlyId', {
      reportmonthlyId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });
  }

  ReportmonthlyService.$inject = ['$http', '$q'];

  function ReportmonthlyService($http, $q) {
    this.getReportMonthlies = function (reportdate, empId) {
      var deferred = $q.defer();
      $http.get('/api/reportmonthly/' + reportdate + '/' + empId).success(function (report) {
        deferred.resolve(report);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }

}());
