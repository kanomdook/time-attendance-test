(function () {
  'use strict';

  // Reportdailies controller
  angular
    .module('reportdailies')
    .controller('ReportdailiesController', ReportdailiesController);

  ReportdailiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'reportdailyResolve'];

  function ReportdailiesController ($scope, $state, $window, Authentication, reportdaily) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reportdaily = reportdaily;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reportdaily
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.reportdaily.$remove($state.go('reportdailies.list'));
      }
    }

    // Save Reportdaily
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reportdailyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reportdaily._id) {
        vm.reportdaily.$update(successCallback, errorCallback);
      } else {
        vm.reportdaily.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reportdailies.view', {
          reportdailyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
