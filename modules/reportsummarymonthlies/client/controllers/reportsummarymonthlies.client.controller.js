(function () {
  'use strict';

  // Reportsummarymonthlies controller
  angular
    .module('reportsummarymonthlies')
    .controller('ReportsummarymonthliesController', ReportsummarymonthliesController);

  ReportsummarymonthliesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'reportsummarymonthlyResolve'];

  function ReportsummarymonthliesController ($scope, $state, $window, Authentication, reportsummarymonthly) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reportsummarymonthly = reportsummarymonthly;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reportsummarymonthly
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.reportsummarymonthly.$remove($state.go('reportsummarymonthlies.list'));
      }
    }

    // Save Reportsummarymonthly
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reportsummarymonthlyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reportsummarymonthly._id) {
        vm.reportsummarymonthly.$update(successCallback, errorCallback);
      } else {
        vm.reportsummarymonthly.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reportsummarymonthlies.view', {
          reportsummarymonthlyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
