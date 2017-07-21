// Reportdailies service used to communicate Reportdailies REST endpoints
(function() {
    'use strict';

    angular
        .module('reportdailies')
        .factory('ReportdailiesService', ReportdailiesService)
        .service('ReportdailiesDayService', ReportdailiesDayService);

    ReportdailiesService.$inject = ['$resource'];

    function ReportdailiesService($resource) {
        return $resource('api/reportdailies/:reportdailyId', {
            reportdailyId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

    ReportdailiesDayService.$inject = ['$http', '$q'];

    function ReportdailiesDayService($http, $q) {
        this.getReportDailies = function(reportdate) {
            var deferred = $q.defer();
            $http.get('/api/reportdaily/' + reportdate).success(function(report) {
                deferred.resolve(report);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }

}());
