(function () {
  'use strict';

  // Reportmonthlies controller
  angular
    .module('reportmonthlies')
    .controller('ReportmonthliesController', ReportmonthliesController);

  ReportmonthliesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'reportmonthlyResolve'];

  function ReportmonthliesController ($scope, $state, $window, Authentication, reportmonthly) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reportmonthly = reportmonthly;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reportmonthly
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.reportmonthly.$remove($state.go('reportmonthlies.list'));
      }
    }

    // Save Reportmonthly
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reportmonthlyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reportmonthly._id) {
        vm.reportmonthly.$update(successCallback, errorCallback);
      } else {
        vm.reportmonthly.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reportmonthlies.view', {
          reportmonthlyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
