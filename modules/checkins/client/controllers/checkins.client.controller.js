(function () {
  'use strict';

  // Checkins controller
  angular
    .module('checkins')
    .controller('CheckinsController', CheckinsController);

  CheckinsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'checkinResolve'];

  function CheckinsController ($scope, $state, $window, Authentication, checkin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.checkin = checkin;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Checkin
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.checkin.$remove($state.go('checkins.list'));
      }
    }

    function getCheckinsList(){
      
    }

    // Save Checkin
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.checkinForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.checkin._id) {
        vm.checkin.$update(successCallback, errorCallback);
      } else {
        vm.checkin.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('checkins.view', {
          checkinId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
