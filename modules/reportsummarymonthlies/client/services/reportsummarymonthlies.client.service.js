// Reportsummarymonthlies service used to communicate Reportsummarymonthlies REST endpoints
(function () {
  'use strict';

  angular
    .module('reportsummarymonthlies')
    .factory('ReportsummarymonthliesService', ReportsummarymonthliesService)
    .service('ReportSummaryMonthlyService', ReportSummaryMonthlyService);

  ReportsummarymonthliesService.$inject = ['$resource'];

  function ReportsummarymonthliesService($resource) {
    return $resource('api/reportsummarymonthlies/:reportsummarymonthlyId', {
      reportsummarymonthlyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  ReportSummaryMonthlyService.$inject = ['$http', '$q'];

  function ReportSummaryMonthlyService($http, $q) {
    this.getReportSummaryMonthlies = function (companyId,inputDateStrat, inputDateEnd) {
      var deferred = $q.defer();

      $http.get('/api/reportsummarymonthly/' + companyId +'/'+ inputDateStrat + '/' + inputDateEnd).success(function (report) {
        deferred.resolve(report);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }

}());
